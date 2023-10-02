import { distinctUntilChanged, filter, map, of, switchMap } from 'rxjs';
import { distinctUntilArrayItemChanged } from './arrayFind';
import { coerceArray } from './coerceArray';
import { entitiesToArray } from './entitiesToArray';
import { entitiesToMap } from './entitiesToMap';
import { findEntityByPredicate, getEntity } from './getEntity';
import { isArray } from './isArray';
import { isDefined } from './isDefined';
import { isFunction } from './isFunction';
import { isNil } from './isNil';
import { mapSkipUndefined } from './mapSkipUndefined';
import { Query } from './query';
import { sortByOptions } from './sortByOptions';
import { toBoolean } from './toBoolean';
/**
 *
 *  The Entity Query is similar to the general Query, with additional functionality tailored for EntityStores.
 *
 *  class WidgetsQuery extends QueryEntity<WidgetsState> {
 *     constructor(protected store: WidgetsStore) {
 *       super(store);
 *     }
 *  }
 *
 *
 *
 */
export class QueryEntity extends Query {
    constructor(store, options = {}) {
        super(store);
        this.options = options;
        this.__store__ = store;
    }
    selectAll(options = {
        asObject: false,
    }) {
        return this.select((state) => state.entities).pipe(map(() => this.getAll(options)));
    }
    getAll(options = { asObject: false, filterBy: undefined, limitTo: undefined }) {
        if (options.asObject) {
            return entitiesToMap(this.getValue(), options);
        }
        sortByOptions(options, this.config || this.options);
        return entitiesToArray(this.getValue(), options);
    }
    selectMany(ids, project) {
        if (!ids || !ids.length)
            return of([]);
        return this.select((state) => state.entities).pipe(map((entities) => mapSkipUndefined(ids, (id) => getEntity(id, project)(entities))), distinctUntilArrayItemChanged());
    }
    selectEntity(idOrPredicate, project) {
        let id = idOrPredicate;
        if (isFunction(idOrPredicate)) {
            // For performance reason we expect the entity to be in the store
            id = findEntityByPredicate(idOrPredicate, this.getValue().entities);
        }
        return this.select((state) => state.entities).pipe(map(getEntity(id, project)), distinctUntilChanged());
    }
    /**
     * Get an entity by id
     *
     * @example
     *
     * this.query.getEntity(1);
     */
    getEntity(id) {
        return this.getValue().entities[id];
    }
    /**
     * Select the active entity's id
     *
     * @example
     *
     * this.query.selectActiveId()
     */
    selectActiveId() {
        return this.select((state) => state.active);
    }
    /**
     * Get the active id
     *
     * @example
     *
     * this.query.getActiveId()
     */
    getActiveId() {
        return this.getValue().active;
    }
    selectActive(project) {
        if (isArray(this.getActive())) {
            return this.selectActiveId().pipe(switchMap((ids) => this.selectMany(ids, project)));
        }
        return this.selectActiveId().pipe(switchMap((ids) => this.selectEntity(ids, project)));
    }
    getActive() {
        const activeId = this.getActiveId();
        if (isArray(activeId)) {
            return activeId.map((id) => this.getValue().entities[id]);
        }
        return toBoolean(activeId) ? this.getEntity(activeId) : undefined;
    }
    /**
     * Select the store's entity collection length
     *
     * @example
     *
     * this.query.selectCount()
     * this.query.selectCount(entity => entity.completed)
     */
    selectCount(predicate) {
        return this.select((state) => state.entities).pipe(map(() => this.getCount(predicate)));
    }
    /**
     * Get the store's entity collection length
     *
     * @example
     *
     * this.query.getCount()
     * this.query.getCount(entity => entity.completed)
     */
    getCount(predicate) {
        if (isFunction(predicate)) {
            return this.getAll().filter(predicate).length;
        }
        return this.getValue().ids.length;
    }
    selectLast(project) {
        return this.selectAt((ids) => ids[ids.length - 1], project);
    }
    selectFirst(project) {
        return this.selectAt((ids) => ids[0], project);
    }
    selectEntityAction(actionOrActions) {
        if (isNil(actionOrActions)) {
            return this.store.selectEntityAction$;
        }
        const project = isArray(actionOrActions) ? (action) => action : ({ ids }) => ids;
        const actions = coerceArray(actionOrActions);
        return this.store.selectEntityAction$.pipe(filter(({ type }) => actions.includes(type)), map((action) => project(action)));
    }
    hasEntity(projectOrIds) {
        if (isNil(projectOrIds)) {
            return this.getValue().ids.length > 0;
        }
        if (isFunction(projectOrIds)) {
            return this.getAll().some(projectOrIds);
        }
        if (isArray(projectOrIds)) {
            return projectOrIds.every((id) => id in this.getValue().entities);
        }
        return projectOrIds in this.getValue().entities;
    }
    /**
     * Returns whether entity store has an active entity
     *
     * @example
     *
     * this.query.hasActive()
     * this.query.hasActive(3)
     *
     */
    hasActive(id) {
        const active = this.getValue().active;
        const isIdProvided = isDefined(id);
        if (Array.isArray(active)) {
            if (isIdProvided) {
                return active.includes(id);
            }
            return active.length > 0;
        }
        return isIdProvided ? active === id : isDefined(active);
    }
    /**
     *
     * Create sub UI query for querying Entity's UI state
     *
     * @example
     *
     *
     * export class ProductsQuery extends QueryEntity<ProductsState> {
     *   ui: EntityUIQuery<ProductsUIState>;
     *
     *   constructor(protected store: ProductsStore) {
     *     super(store);
     *     this.createUIQuery();
     *   }
     *
     * }
     */
    createUIQuery() {
        this.ui = new EntityUIQuery(this.__store__.ui);
    }
    selectAt(mapFn, project) {
        return this.select((state) => state.ids).pipe(map(mapFn), distinctUntilChanged(), switchMap((id) => this.selectEntity(id, project)));
    }
}
// @internal
export class EntityUIQuery extends QueryEntity {
    constructor(store) {
        super(store);
    }
}
//# sourceMappingURL=queryEntity.js.map