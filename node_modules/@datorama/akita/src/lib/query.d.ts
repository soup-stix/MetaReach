import { Observable } from 'rxjs';
import { QueryConfigOptions } from './queryConfig';
import { Store } from './store';
import { ReturnTypes } from './types';
export declare class Query<S> {
    protected store: Store<S>;
    __store__: Store<S>;
    constructor(store: Store<S>);
    /**
     * Select a slice from the store
     *
     * @example
     *
     * this.query.select()
     * this.query.select(state => state.entities)
     * this.query.select('token');
     * this.query.select(['name', 'email'])
     * this.query.select([state => state.name, state => state.age])
     *
     */
    select<K extends keyof S>(key: K): Observable<S[K]>;
    select<R>(project: (store: S) => R): Observable<R>;
    select<K extends keyof S>(stateKeys: K[]): Observable<Pick<S, K>>;
    select<R extends [(state: S) => any] | Array<(state: S) => any>>(selectorFns: R): Observable<ReturnTypes<R>>;
    select(): Observable<S>;
    /**
     * Select the loading state
     *
     * @example
     *
     * this.query.selectLoading().subscribe(isLoading => {})
     */
    selectLoading(): Observable<boolean>;
    /**
     * Select the error state
     *
     * @example
     *
     * this.query.selectError().subscribe(error => {})
     */
    selectError<ErrorType = any>(): Observable<ErrorType>;
    /**
     * Get the store's value
     *
     * @example
     *
     * this.query.getValue()
     *
     */
    getValue(): S;
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
    selectHasCache(): Observable<boolean>;
    /**
     * Whether we've cached data
     *
     * @example
     *
     * this.query.getHasCache()
     *
     */
    getHasCache(): boolean;
    get config(): QueryConfigOptions;
}
