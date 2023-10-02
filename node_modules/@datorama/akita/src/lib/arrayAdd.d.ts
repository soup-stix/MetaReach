import { OrArray } from './types';
import { AddEntitiesOptions } from './addEntities';
/**
 * Add item to a collection
 *
 * @example
 *
 *
 * store.update(state => ({
 *   comments: arrayAdd(state.comments, { id: 2 })
 * }))
 *
 */
export declare function arrayAdd<T extends any[], Entity = any>(arr: T, newEntity: OrArray<Entity>, options?: AddEntitiesOptions): T;
