import { IDS, ItemPredicate } from './types';
/**
 * Update item in a collection
 *
 * @example
 *
 *
 * store.update(1, entity => ({
 *   comments: arrayUpdate(entity.comments, 1, { name: 'newComment' })
 * }))
 */
export declare function arrayUpdate<T extends any[], Entity = any>(arr: T, predicateOrIds: IDS | ItemPredicate<Entity>, obj: Partial<Entity>, idKey?: string): T;
