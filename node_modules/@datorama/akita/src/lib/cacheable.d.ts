import { Observable } from 'rxjs';
import { Store } from './store';
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
export declare function cacheable<T>(store: Store, request$: Observable<T>, options?: {
    emitNext: boolean;
}): Observable<T | undefined | never>;
