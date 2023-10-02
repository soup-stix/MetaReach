export interface ResetStoresParams {
    exclude: string[];
}
/**
 * Reset stores back to their initial state
 *
 * @example
 *
 * resetStores()
 * resetStores({
 *   exclude: ['auth']
 * })
 */
export declare function resetStores(options?: Partial<ResetStoresParams>): void;
