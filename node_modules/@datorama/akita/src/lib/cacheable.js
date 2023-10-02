import { EMPTY, of } from 'rxjs';
/**
 *
 * Helper function for checking if we have data in cache
 *
 * export class ProductsService {
 *   constructor(private productsStore: ProductsStore) {}

 *   get(): Observable<void> {
 *     const request = this.http.get().pipe(
 *       tap(this.productsStore.set(response))
 *     );
 *
 *     return cacheable(this.productsStore, request);
 *   }
 * }
 */
export function cacheable(store, request$, options = { emitNext: false }) {
    if (store._cache().value) {
        return options.emitNext ? of(undefined) : EMPTY;
    }
    return request$;
}
//# sourceMappingURL=cacheable.js.map