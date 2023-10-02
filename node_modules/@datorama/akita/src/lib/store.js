import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { currentAction, resetCustomAction, setAction } from './actions';
import { getAkitaConfig, getGlobalProducerFn } from './config';
import { deepFreeze } from './deepFreeze';
import { dispatchAdded, dispatchDeleted, dispatchUpdate } from './dispatchers';
import { isDev, __DEV__ } from './env';
import { assertStoreHasName } from './errors';
import { isDefined } from './isDefined';
import { isFunction } from './isFunction';
import { isPlainObject } from './isPlainObject';
import { isBrowser } from './root';
import { configKey } from './storeConfig';
import { __stores__ } from './stores';
import { commit, isTransactionInProcess } from './transaction';
/**
 *
 * Store for managing any type of data
 *
 * @example
 *
 * export interface SessionState {
 *   token: string;
 *   userDetails: UserDetails
 * }
 *
 * export function createInitialState(): SessionState {
 *  return {
 *    token: '',
 *    userDetails: null
 *  };
 * }
 *
 * @StoreConfig({ name: 'session' })
 * export class SessionStore extends Store<SessionState> {
 *   constructor() {
 *    super(createInitialState());
 *   }
 * }
 */
export class Store {
    constructor(initialState, options = {}) {
        this.options = options;
        this.inTransaction = false;
        this.cache = {
            active: new BehaviorSubject(false),
            ttl: null,
        };
        this.onInit(initialState);
    }
    /**
     *  Set the loading state
     *
     *  @example
     *
     *  store.setLoading(true)
     *
     */
    setLoading(loading = false) {
        if (loading !== this._value().loading) {
            isDev() && setAction('Set Loading');
            this._setState((state) => ({ ...state, loading }));
        }
    }
    /**
     *
     * Set whether the data is cached
     *
     * @example
     *
     * store.setHasCache(true)
     * store.setHasCache(false)
     * store.setHasCache(true, { restartTTL: true })
     *
     */
    setHasCache(hasCache, options = { restartTTL: false }) {
        if (hasCache !== this.cache.active.value) {
            this.cache.active.next(hasCache);
        }
        if (options.restartTTL) {
            const ttlConfig = this.getCacheTTL();
            if (ttlConfig) {
                if (this.cache.ttl !== null) {
                    clearTimeout(this.cache.ttl);
                }
                this.cache.ttl = setTimeout(() => this.setHasCache(false), ttlConfig);
            }
        }
    }
    /**
     *
     * Sometimes we need to access the store value from a store
     *
     * @example middleware
     *
     */
    getValue() {
        return this.storeValue;
    }
    /**
     *  Set the error state
     *
     *  @example
     *
     *  store.setError({text: 'unable to load data' })
     *
     */
    setError(error) {
        if (error !== this._value().error) {
            isDev() && setAction('Set Error');
            this._setState((state) => ({ ...state, error }));
        }
    }
    // @internal
    _select(project) {
        return this.store.asObservable().pipe(map((snapshot) => project(snapshot.state)), distinctUntilChanged());
    }
    // @internal
    _value() {
        return this.storeValue;
    }
    // @internal
    _cache() {
        return this.cache.active;
    }
    // @internal
    get config() {
        return this.constructor[configKey] || {};
    }
    // @internal
    get storeName() {
        return this.config.storeName || this.options.storeName || this.options.name;
    }
    // @internal
    get deepFreeze() {
        return this.config.deepFreezeFn || this.options.deepFreezeFn || deepFreeze;
    }
    // @internal
    get cacheConfig() {
        return this.config.cache || this.options.cache;
    }
    get _producerFn() {
        return this.config.producerFn || this.options.producerFn || getGlobalProducerFn();
    }
    // @internal
    get resettable() {
        return isDefined(this.config.resettable) ? this.config.resettable : this.options.resettable;
    }
    // @internal
    _setState(newState, _dispatchAction = true) {
        if (isFunction(newState)) {
            const _newState = newState(this._value());
            this.storeValue = __DEV__ ? this.deepFreeze(_newState) : _newState;
        }
        else {
            this.storeValue = newState;
        }
        if (!this.store) {
            this.store = new BehaviorSubject({ state: this.storeValue });
            if (isDev()) {
                this.store.subscribe(({ action }) => {
                    if (action) {
                        dispatchUpdate(this.storeName, action);
                    }
                });
            }
            return;
        }
        if (isTransactionInProcess()) {
            this.handleTransaction();
            return;
        }
        this.dispatch(this.storeValue, _dispatchAction);
    }
    /**
     *
     * Reset the current store back to the initial value
     *
     * @example
     *
     * store.reset()
     *
     */
    reset() {
        if (this.isResettable()) {
            isDev() && setAction('Reset');
            this._setState(() => Object.assign({}, this._initialState));
            this.setHasCache(false);
        }
    }
    update(stateOrCallback) {
        isDev() && setAction('Update');
        let newState;
        const currentState = this._value();
        if (isFunction(stateOrCallback)) {
            newState = isFunction(this._producerFn) ? this._producerFn(currentState, stateOrCallback) : stateOrCallback(currentState);
        }
        else {
            newState = stateOrCallback;
        }
        const withHook = this.akitaPreUpdate(currentState, { ...currentState, ...newState });
        const resolved = isPlainObject(currentState) ? withHook : new currentState.constructor(withHook);
        this._setState(resolved);
    }
    updateStoreConfig(newOptions) {
        this.options = { ...this.options, ...newOptions };
    }
    // @internal
    akitaPreUpdate(_, nextState) {
        return nextState;
    }
    /**
     *
     * Destroy the store
     *
     * @example
     *
     * store.destroy()
     *
     */
    destroy() {
        const hmrEnabled = isBrowser ? window.hmrEnabled : false;
        if (!hmrEnabled && this === __stores__[this.storeName]) {
            delete __stores__[this.storeName];
            dispatchDeleted(this.storeName);
            this.setHasCache(false);
            this.cache.active.complete();
            this.store.complete();
        }
    }
    onInit(initialState) {
        __stores__[this.storeName] = this;
        this._setState(() => initialState);
        dispatchAdded(this.storeName);
        if (this.isResettable()) {
            this._initialState = initialState;
        }
        isDev() && assertStoreHasName(this.storeName, this.constructor.name);
    }
    dispatch(state, _dispatchAction = true) {
        let action = undefined;
        if (_dispatchAction) {
            action = currentAction;
            resetCustomAction();
        }
        this.store.next({ state, action });
    }
    watchTransaction() {
        commit().subscribe(() => {
            this.inTransaction = false;
            this.dispatch(this._value());
        });
    }
    isResettable() {
        if (this.resettable === false) {
            return false;
        }
        return this.resettable || getAkitaConfig().resettable;
    }
    handleTransaction() {
        if (!this.inTransaction) {
            this.watchTransaction();
            this.inTransaction = true;
        }
    }
    getCacheTTL() {
        return (this.cacheConfig && this.cacheConfig.ttl) || getAkitaConfig().ttl;
    }
}
//# sourceMappingURL=store.js.map