import { ID } from './types';
/**
 * Upsert item in a collection
 *
 * @example
 *
 *
 * store.update(1, entity => ({
 *   comments: arrayUpsert(entity.comments, 1, { name: 'newComment' })
 * }))
 */
export declare function arrayUpsert<Root extends any[]>(arr: Root, id: ID, obj: Partial<Root[0]>, idKey?: string): Root[0][];
