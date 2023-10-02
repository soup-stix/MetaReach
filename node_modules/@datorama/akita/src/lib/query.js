import { distinctUntilChanged, map } from 'rxjs';
import { compareKeys } from './compareKeys';
import { isDev } from './env';
import { isFunction } from './isFunction';
import { isString } from './isString';
import { queryConfigKey } from './queryConfig';
import { __queries__ } from './stores';
export class Query {
    constructor(store) {
        this.store = store;
        this.__store__ = store;
        if (isDev()) {
            // @internal
            __queries__[store.storeName] = this;
        }
    }
    select(project) {
        let mapFn;
        if (isFunction(project)) {
            mapFn = project;
        }
        else if (isString(project)) {
            mapFn = (state) => state[project];
        }
        else if (Array.isArray(project)) {
            return this.store
                ._select((state) => state)
                .pipe(distinctUntilChanged(compareKeys(project)), map((state) => {
                if (isFunction(project[0])) {
                    return project.map((func) => func(state));
                }
                return project.reduce((acc, k) => {
                    acc[k] = state[k];
                    return acc;
                }, {});
            }));
        }
        else {
            mapFn = (state) => state;
        }
        return this.store._select(mapFn);
    }
    /**
     * Select the loading state
     *
     * @example
     *
     * this.query.selectLoading().subscribe(isLoading => {})
     */
    selectLoading() {
        return this.select((state) => state.loading);
    }
    /**
     * Select the error state
     *
     * @example
     *
     * this.query.selectError().subscribe(error => {})
     */
    selectError() {
        return this.select((state) => state.error);
    }
    /**
     * Get the store's value
     *
     * @example
     *
     * this.query.getValue()
     *
     */
    getValue() {
        return this.store._value();
    }
    /**
     * Select the cache state
     *
     * @example
     *
     * this.query.selectHasCache().pipe(
     *   switchMap(hasCache => {
     *     return hasCache ? of() : http().pipe(res => store.set(res))
     *   })
     * )
     */
    selectHasCache() {
        return this.store._cache().asObservable();
    }
    /**
     * Whether we've cached data
     *
     * @example
     *
     * this.query.getHasCache()
     *
     */
    getHasCache() {
        return this.store._cache().value;
    }
    // @internal
    get config() {
        return this.constructor[queryConfigKey];
    }
}
//# sourceMappingURL=query.js.map