import { MonoTypeOperatorFunction } from 'rxjs';
import { QueryEntity } from './queryEntity';
import { EntityState, getEntityType, getQueryEntityState } from './types';
/**
 * Track id updates of an entity and re-evaluation the query with the changed entity id.
 * Hint: Don't place the operator after other operators in the same pipeline as those will be skipped on
 * re-evaluation. Also, it can't be used with the selection operator, e.g <code>selectEntity(1, e => e.title)</code>
 * @param query The query from which the entity is selected.
 * @example
 *
 *   query.selectEntity(1).pipe(trackIdChanges(query)).subscribe(entity => { ... })
 *
 */
export declare function trackIdChanges<K extends QueryEntity<S, T>, S extends EntityState<T> = getQueryEntityState<K>, T = getEntityType<S>>(query: K): MonoTypeOperatorFunction<T>;
