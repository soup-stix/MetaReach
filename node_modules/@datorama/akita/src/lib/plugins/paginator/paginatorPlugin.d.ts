import { Observable } from 'rxjs';
import { QueryEntity } from '../../queryEntity';
import { EntityState, getEntityType } from '../../types';
import { AkitaPlugin } from '../plugin';
export interface PaginationResponse<E> {
    currentPage: number;
    perPage: number;
    lastPage: number;
    data: E[];
    total?: number;
    from?: number;
    to?: number;
    pageControls?: number[];
}
export declare type PaginatorConfig = {
    pagesControls?: boolean;
    range?: boolean;
    startWith?: number;
    cacheTimeout?: Observable<number>;
    clearStoreWithCache?: boolean;
};
export declare class PaginatorPlugin<State extends EntityState> extends AkitaPlugin<State> {
    protected query: QueryEntity<State>;
    config: PaginatorConfig;
    /** Save current filters, sorting, etc. in cache */
    metadata: Map<any, any>;
    private page;
    private pages;
    private readonly clearCacheSubscription;
    private pagination;
    /**
     * When the user navigates to a different page and return
     * we don't want to call `clearCache` on first time.
     */
    private initial;
    constructor(query: QueryEntity<State>, config?: PaginatorConfig);
    /**
     * Proxy to the query loading
     */
    isLoading$: Observable<boolean>;
    /**
     * Listen to page changes
     */
    get pageChanges(): Observable<number>;
    /**
     * Get the current page number
     */
    get currentPage(): number;
    /**
     * Check if current page is the first one
     */
    get isFirst(): boolean;
    /**
     * Check if current page is the last one
     */
    get isLast(): boolean;
    /**
     * Whether to generate an array of pages for *ngFor
     * [1, 2, 3, 4]
     */
    withControls(): this;
    /**
     * Whether to generate the `from` and `to` keys
     * [1, 2, 3, 4]
     */
    withRange(): this;
    /**
     * Set the loading state
     */
    setLoading(value?: boolean): void;
    /**
     * Update the pagination object and add the page
     */
    update(response: PaginationResponse<getEntityType<State>>): void;
    /**
     *
     * Set the ids and add the page to store
     */
    addPage(data: getEntityType<State>[]): void;
    /**
     * Clear the cache.
     */
    clearCache(options?: {
        clearStore?: boolean;
    }): void;
    clearPage(page: number): void;
    /**
     * Clear the cache timeout and optionally the pages
     */
    destroy({ clearCache, currentPage }?: {
        clearCache?: boolean;
        currentPage?: number;
    }): void;
    /**
     * Whether the provided page is active
     */
    isPageActive(page: number): boolean;
    /**
     * Set the current page
     */
    setPage(page: number): void;
    /**
     * Increment current page
     */
    nextPage(): void;
    /**
     * Decrement current page
     */
    prevPage(): void;
    /**
     * Set current page to last
     */
    setLastPage(): void;
    /**
     * Set current page to first
     */
    setFirstPage(): void;
    /**
     * Check if page exists in cache
     */
    hasPage(page: number): boolean;
    /**
     * Get the current page if it's in cache, otherwise invoke the request
     */
    getPage(req: () => Observable<PaginationResponse<getEntityType<State>>>): Observable<PaginationResponse<getEntityType<State>>>;
    getQuery(): QueryEntity<State>;
    refreshCurrentPage(): void;
    private getFrom;
    private getTo;
    /**
     * Select the page
     */
    private selectPage;
}
/** backward compatibility */
export declare const Paginator: typeof PaginatorPlugin;
