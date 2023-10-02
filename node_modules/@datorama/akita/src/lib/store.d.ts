import { BehaviorSubject, Observable } from 'rxjs';
import { deepFreeze } from './deepFreeze';
import { StoreConfigOptions, UpdatableStoreConfigOptions } from './storeConfig';
import { StoreCache, UpdateStateCallback } from './types';
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
export declare class Store<S = any> {
    protected options: Partial<StoreConfigOptions>;
    private store;
    private storeValue;
    private inTransaction;
    private _initialState;
    protected cache: StoreCache;
    constructor(initialState: Partial<S>, options?: Partial<StoreConfigOptions>);
    /**
     *  Set the loading state
     *
     *  @example
     *
     *  store.setLoading(true)
     *
     */
    setLoading(loading?: boolean): void;
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
    setHasCache(hasCache: boolean, options?: {
        restartTTL: boolean;
    }): void;
    /**
     *
     * Sometimes we need to access the store value from a store
     *
     * @example middleware
     *
     */
    getValue(): S;
    /**
     *  Set the error state
     *
     *  @example
     *
     *  store.setError({text: 'unable to load data' })
     *
     */
    setError<T>(error: T): void;
    _select<R>(project: (store: S) => R): Observable<R>;
    _value(): S;
    _cache(): BehaviorSubject<boolean>;
    get config(): StoreConfigOptions;
    get storeName(): string;
    get deepFreeze(): typeof deepFreeze;
    get cacheConfig(): {
        ttl: number;
    };
    get _producerFn(): (state: any, fn: any) => any;
    get resettable(): boolean;
    _setState(newState: ((state: Readonly<S>) => S) | S, _dispatchAction?: boolean): void;
    /**
     *
     * Reset the current store back to the initial value
     *
     * @example
     *
     * store.reset()
     *
     */
    reset(): void;
    /**
     *
     * Update the store's value
     *
     * @example
     *
     * this.store.update(state => {
     *   return {...}
     * })
     */
    update(stateCallback: UpdateStateCallback<S>): any;
    /**
     *
     * @example
     *
     *  this.store.update({ token: token })
     */
    update(state: Partial<S>): any;
    updateStoreConfig(newOptions: UpdatableStoreConfigOptions): void;
    akitaPreUpdate(_: Readonly<S>, nextState: Readonly<S>): S;
    /**
     *
     * Destroy the store
     *
     * @example
     *
     * store.destroy()
     *
     */
    destroy(): void;
    private onInit;
    private dispatch;
    private watchTransaction;
    private isResettable;
    private handleTransaction;
    private getCacheTTL;
}
