import { __decorate, __metadata } from "tslib";
import { BehaviorSubject, delay, from, isObservable, map, switchMap, take } from 'rxjs';
import { action, logAction } from '../../actions';
import { isNil } from '../../isNil';
import { isUndefined } from '../../isUndefined';
import { applyTransaction } from '../../transaction';
import { AkitaPlugin } from '../plugin';
const paginatorDefaults = {
    pagesControls: false,
    range: false,
    startWith: 1,
    cacheTimeout: undefined,
    clearStoreWithCache: true,
};
export class PaginatorPlugin extends AkitaPlugin {
    constructor(query, config = {}) {
        super(query, {
            resetFn: () => {
                this.initial = false;
                this.destroy({ clearCache: true, currentPage: 1 });
            },
        });
        this.query = query;
        this.config = config;
        /** Save current filters, sorting, etc. in cache */
        this.metadata = new Map();
        this.pages = new Map();
        this.pagination = {
            currentPage: 1,
            perPage: 0,
            total: 0,
            lastPage: 0,
            data: [],
        };
        /**
         * When the user navigates to a different page and return
         * we don't want to call `clearCache` on first time.
         */
        this.initial = true;
        /**
         * Proxy to the query loading
         */
        this.isLoading$ = this.query.selectLoading().pipe(delay(0));
        this.config = { ...paginatorDefaults, ...config };
        const { startWith, cacheTimeout } = this.config;
        this.page = new BehaviorSubject(startWith);
        if (isObservable(cacheTimeout)) {
            this.clearCacheSubscription = cacheTimeout.subscribe(() => this.clearCache());
        }
    }
    /**
     * Listen to page changes
     */
    get pageChanges() {
        return this.page.asObservable();
    }
    /**
     * Get the current page number
     */
    get currentPage() {
        return this.pagination.currentPage;
    }
    /**
     * Check if current page is the first one
     */
    get isFirst() {
        return this.currentPage === 1;
    }
    /**
     * Check if current page is the last one
     */
    get isLast() {
        return this.currentPage === this.pagination.lastPage;
    }
    /**
     * Whether to generate an array of pages for *ngFor
     * [1, 2, 3, 4]
     */
    withControls() {
        this.config.pagesControls = true;
        return this;
    }
    /**
     * Whether to generate the `from` and `to` keys
     * [1, 2, 3, 4]
     */
    withRange() {
        this.config.range = true;
        return this;
    }
    /**
     * Set the loading state
     */
    setLoading(value = true) {
        this.getStore().setLoading(value);
    }
    /**
     * Update the pagination object and add the page
     */
    update(response) {
        this.pagination = response;
        this.addPage(response.data);
    }
    /**
     *
     * Set the ids and add the page to store
     */
    addPage(data) {
        this.pages.set(this.currentPage, { ids: data.map((entity) => entity[this.getStore().idKey]) });
        this.getStore().upsertMany(data);
    }
    /**
     * Clear the cache.
     */
    clearCache(options = {}) {
        if (!this.initial) {
            logAction('@Pagination - Clear Cache');
            if (options.clearStore !== false && (this.config.clearStoreWithCache || options.clearStore)) {
                this.getStore().remove();
            }
            this.pages = new Map();
            this.metadata = new Map();
        }
        this.initial = false;
    }
    clearPage(page) {
        this.pages.delete(page);
    }
    /**
     * Clear the cache timeout and optionally the pages
     */
    destroy({ clearCache, currentPage } = {}) {
        if (this.clearCacheSubscription) {
            this.clearCacheSubscription.unsubscribe();
        }
        if (clearCache) {
            this.clearCache();
        }
        if (!isUndefined(currentPage)) {
            this.setPage(currentPage);
        }
        this.initial = true;
    }
    /**
     * Whether the provided page is active
     */
    isPageActive(page) {
        return this.currentPage === page;
    }
    /**
     * Set the current page
     */
    setPage(page) {
        if (page !== this.currentPage || !this.hasPage(page)) {
            this.page.next((this.pagination.currentPage = page));
        }
    }
    /**
     * Increment current page
     */
    nextPage() {
        if (this.currentPage !== this.pagination.lastPage) {
            this.setPage(this.pagination.currentPage + 1);
        }
    }
    /**
     * Decrement current page
     */
    prevPage() {
        if (this.pagination.currentPage > 1) {
            this.setPage(this.pagination.currentPage - 1);
        }
    }
    /**
     * Set current page to last
     */
    setLastPage() {
        this.setPage(this.pagination.lastPage);
    }
    /**
     * Set current page to first
     */
    setFirstPage() {
        this.setPage(1);
    }
    /**
     * Check if page exists in cache
     */
    hasPage(page) {
        return this.pages.has(page);
    }
    /**
     * Get the current page if it's in cache, otherwise invoke the request
     */
    getPage(req) {
        let page = this.pagination.currentPage;
        if (this.hasPage(page)) {
            return this.selectPage(page);
        }
        else {
            this.setLoading(true);
            return from(req()).pipe(switchMap((config) => {
                page = config.currentPage;
                applyTransaction(() => {
                    this.setLoading(false);
                    this.update(config);
                });
                return this.selectPage(page);
            }));
        }
    }
    getQuery() {
        return this.query;
    }
    refreshCurrentPage() {
        if (isNil(this.currentPage) === false) {
            this.clearPage(this.currentPage);
            this.setPage(this.currentPage);
        }
    }
    getFrom() {
        if (this.isFirst) {
            return 1;
        }
        return (this.currentPage - 1) * this.pagination.perPage + 1;
    }
    getTo() {
        if (this.isLast) {
            return this.pagination.total;
        }
        return this.currentPage * this.pagination.perPage;
    }
    /**
     * Select the page
     */
    selectPage(page) {
        return this.query.selectAll({ asObject: true }).pipe(take(1), map((entities) => {
            const response = {
                ...this.pagination,
                data: this.pages.get(page).ids.map((id) => entities[id]),
            };
            const { range, pagesControls } = this.config;
            /** If no total - calc it */
            if (isNaN(this.pagination.total)) {
                if (response.lastPage === 1) {
                    response.total = response.data ? response.data.length : 0;
                }
                else {
                    response.total = response.perPage * response.lastPage;
                }
                this.pagination.total = response.total;
            }
            if (range) {
                response.from = this.getFrom();
                response.to = this.getTo();
            }
            if (pagesControls) {
                response.pageControls = generatePages(this.pagination.total, this.pagination.perPage);
            }
            return response;
        }));
    }
}
__decorate([
    action('@Pagination - New Page'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaginatorPlugin.prototype, "update", null);
/**
 * Generate an array so we can ngFor them to navigate between pages
 */
function generatePages(total, perPage) {
    const len = Math.ceil(total / perPage);
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(i + 1);
    }
    return arr;
}
/** backward compatibility */
export const Paginator = PaginatorPlugin;
//# sourceMappingURL=paginatorPlugin.js.map