import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { ID, IDS, ItemPredicate } from './types';
export declare function find<T>(collection: T[], idsOrPredicate: IDS | ItemPredicate, idKey: string): any[];
export declare function distinctUntilArrayItemChanged<T>(): MonoTypeOperatorFunction<T[]>;
/**
 * Find items in a collection
 *
 * @example
 *
 *  selectEntity(1, 'comments').pipe(
 *   arrayFind(comment => comment.text = 'text')
 * )
 */
export declare function arrayFind<T>(ids: ItemPredicate<T>, idKey?: never): (source: Observable<T[]>) => Observable<T[]>;
/**
 * @example
 *
 * selectEntity(1, 'comments').pipe(
 *   arrayFind(3)
 * )
 */
export declare function arrayFind<T>(ids: ID, idKey?: string): (source: Observable<T[]>) => Observable<T>;
/**
 * @example
 *
 * selectEntity(1, 'comments').pipe(
 *   arrayFind([1, 2, 3])
 * )
 */
export declare function arrayFind<T>(ids: ID[], idKey?: string): (source: Observable<T[]>) => Observable<T[]>;
