import { IDS, ItemPredicate } from './types';
/**
 * Remove item from collection
 *
 * @example
 *
 *
 * store.update(state => ({
 *   names: arrayRemove(state.names, ['one', 'second'])
 * }))
 */
export declare function arrayRemove<T extends any[], Entity = any>(arr: T, identifier: IDS | ItemPredicate<Entity>, idKey?: string): T;
