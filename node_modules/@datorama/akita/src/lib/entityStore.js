var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Subject } from 'rxjs';
import { logAction, setAction } from './actions';
import { addEntities } from './addEntities';
import { coerceArray } from './coerceArray';
import { DEFAULT_ID_KEY } from './defaultIDKey';
import { EntityActions } from './entityActions';
import { isDev } from './env';
import { getActiveEntities } from './getActiveEntities';
import { getInitialEntitiesState } from './getInitialEntitiesState';
import { hasEntity } from './hasEntity';
import { isDefined } from './isDefined';
import { isEmpty } from './isEmpty';
import { isFunction } from './isFunction';
import { isNil } from './isNil';
import { isUndefined } from './isUndefined';
import { removeEntities } from './removeEntities';
import { setEntities } from './setEntities';
import { Store } from './store';
import { transaction } from './transaction';
import { updateEntities } from './updateEntities';
/**
 *
 * Store for managing a collection of entities
 *
 * @example
 *
 * export interface WidgetsState extends EntityState<Widget> { }
 *
 * @StoreConfig({ name: 'widgets' })
 *  export class WidgetsStore extends EntityStore<WidgetsState> {
 *   constructor() {
 *     super();
 *   }
 * }
 *
 *
 */
export class EntityStore extends Store {
    constructor(initialState = {}, options = {}) {
        super({ ...getInitialEntitiesState(), ...initialState }, options);
        this.options = options;
        this.entityActions = new Subject();
        this.entityIdChanges = new Subject();
    }
    // @internal
    get selectEntityAction$() {
        return this.entityActions.asObservable();
    }
    // @internal
    get selectEntityIdChanges$() {
        return this.entityIdChanges.asObservable();
    }
    // @internal
    get idKey() {
        return this.config.idKey || this.options.idKey || DEFAULT_ID_KEY;
    }
    /**
     *
     * Replace current collection with provided collection
     *
     * @example
     *
     * this.store.set([Entity, Entity])
     * this.store.set({ids: [], entities: {}})
     * this.store.set({ 1: {}, 2: {}})
     *
     */
    set(entities, options = {}) {
        if (isNil(entities))
            return;
        isDev() && setAction('Set Entity');
        const isNativePreAdd = this.akitaPreAddEntity === EntityStore.prototype.akitaPreAddEntity;
        this.setHasCache(true, { restartTTL: true });
        this._setState((state) => {
            const newState = setEntities({
                state,
                entities,
                idKey: this.idKey,
                preAddEntity: this.akitaPreAddEntity.bind(this),
                isNativePreAdd,
            });
            if (isUndefined(options.activeId) === false) {
                newState.active = options.activeId;
            }
            return newState;
        });
        if (this.hasInitialUIState()) {
            this.handleUICreation();
        }
        this.entityActions.next({ type: EntityActions.Set, ids: this.ids });
    }
    /**
     * Add entities
     *
     * @example
     *
     * this.store.add([Entity, Entity])
     * this.store.add(Entity)
     * this.store.add(Entity, { prepend: true })
     *
     * this.store.add(Entity, { loading: false })
     */
    add(entities, options = { loading: false }) {
        const collection = coerceArray(entities);
        if (isEmpty(collection))
            return;
        const data = addEntities({
            state: this._value(),
            preAddEntity: this.akitaPreAddEntity.bind(this),
            entities: collection,
            idKey: this.idKey,
            options,
        });
        if (data) {
            isDev() && setAction('Add Entity');
            data.newState.loading = options.loading;
            this._setState(() => data.newState);
            if (this.hasInitialUIState()) {
                this.handleUICreation(true);
            }
            this.entityActions.next({ type: EntityActions.Add, ids: data.newIds });
        }
    }
    update(idsOrFnOrState, newStateOrFn) {
        if (isUndefined(newStateOrFn)) {
            super.update(idsOrFnOrState);
            return;
        }
        let ids = [];
        if (isFunction(idsOrFnOrState)) {
            // We need to filter according the predicate function
            ids = this.ids.filter((id) => idsOrFnOrState(this.entities[id]));
        }
        else {
            // If it's nil we want all of them
            ids = isNil(idsOrFnOrState) ? this.ids : coerceArray(idsOrFnOrState);
        }
        if (isEmpty(ids))
            return;
        isDev() && setAction('Update Entity', ids);
        let entityIdChanged;
        this._setState((state) => updateEntities({
            idKey: this.idKey,
            ids,
            preUpdateEntity: this.akitaPreUpdateEntity.bind(this),
            state,
            newStateOrFn,
            producerFn: this._producerFn,
            onEntityIdChanges: (oldId, newId) => {
                entityIdChanged = { oldId, newId };
                this.entityIdChanges.next({ ...entityIdChanged, pending: true });
            },
        }));
        if (entityIdChanged) {
            this.entityIdChanges.next({ ...entityIdChanged, pending: false });
        }
        this.entityActions.next({ type: EntityActions.Update, ids });
    }
    upsert(ids, newState, onCreate, options = {}) {
        const toArray = coerceArray(ids);
        const predicate = (isUpdate) => (id) => hasEntity(this.entities, id) === isUpdate;
        const baseClass = isFunction(onCreate) ? options.baseClass : onCreate ? onCreate.baseClass : undefined;
        const isClassBased = isFunction(baseClass);
        const updateIds = toArray.filter(predicate(true));
        const newEntities = toArray.filter(predicate(false)).map((id) => {
            const newStateObj = typeof newState === 'function' ? newState({}) : newState;
            const entity = isFunction(onCreate) ? onCreate(id, newStateObj) : newStateObj;
            const withId = { ...entity, [this.idKey]: id };
            if (isClassBased) {
                return new baseClass(withId);
            }
            return withId;
        });
        // it can be any of the three types
        this.update(updateIds, newState);
        this.add(newEntities);
        isDev() && logAction('Upsert Entity');
    }
    /**
     *
     * Upsert entity collection (idKey must be present)
     *
     * @example
     *
     * store.upsertMany([ { id: 1 }, { id: 2 }]);
     *
     * store.upsertMany([ { id: 1 }, { id: 2 }], { loading: true  });
     * store.upsertMany([ { id: 1 }, { id: 2 }], { baseClass: Todo  });
     *
     */
    upsertMany(entities, options = {}) {
        const addedIds = [];
        const updatedIds = [];
        const updatedEntities = {};
        // Update the state directly to optimize performance
        for (const entity of entities) {
            const withPreCheckHook = this.akitaPreCheckEntity(entity);
            const id = withPreCheckHook[this.idKey];
            if (hasEntity(this.entities, id)) {
                const prev = this._value().entities[id];
                const merged = { ...this._value().entities[id], ...withPreCheckHook };
                const next = options.baseClass ? new options.baseClass(merged) : merged;
                const withHook = this.akitaPreUpdateEntity(prev, next);
                const nextId = withHook[this.idKey];
                updatedEntities[nextId] = withHook;
                updatedIds.push(nextId);
            }
            else {
                const newEntity = options.baseClass ? new options.baseClass(withPreCheckHook) : withPreCheckHook;
                const withHook = this.akitaPreAddEntity(newEntity);
                const nextId = withHook[this.idKey];
                addedIds.push(nextId);
                updatedEntities[nextId] = withHook;
            }
        }
        isDev() && logAction('Upsert Many');
        this._setState((state) => ({
            ...state,
            ids: addedIds.length ? [...state.ids, ...addedIds] : state.ids,
            entities: {
                ...state.entities,
                ...updatedEntities,
            },
            loading: !!options.loading,
        }));
        updatedIds.length && this.entityActions.next({ type: EntityActions.Update, ids: updatedIds });
        addedIds.length && this.entityActions.next({ type: EntityActions.Add, ids: addedIds });
        if (addedIds.length && this.hasUIStore()) {
            this.handleUICreation(true);
        }
    }
    /**
     *
     * Replace one or more entities (except the id property)
     *
     *
     * @example
     *
     * this.store.replace(5, newEntity)
     * this.store.replace([1,2,3], newEntity)
     */
    replace(ids, newState) {
        const toArray = coerceArray(ids);
        if (isEmpty(toArray))
            return;
        const replaced = {};
        for (const id of toArray) {
            replaced[id] = { ...newState, [this.idKey]: id };
        }
        isDev() && setAction('Replace Entity', ids);
        this._setState((state) => ({
            ...state,
            entities: {
                ...state.entities,
                ...replaced,
            },
        }));
    }
    /**
     *
     * Move entity inside the collection
     *
     *
     * @example
     *
     * this.store.move(fromIndex, toIndex)
     */
    move(from, to) {
        const ids = this.ids.slice();
        ids.splice(to < 0 ? ids.length + to : to, 0, ids.splice(from, 1)[0]);
        isDev() && setAction('Move Entity');
        this._setState((state) => ({
            ...state,
            // Change the entities reference so that selectAll emit
            entities: {
                ...state.entities,
            },
            ids,
        }));
    }
    remove(idsOrFn) {
        if (isEmpty(this.ids))
            return;
        const idPassed = isDefined(idsOrFn);
        // null means remove all
        let ids = [];
        if (isFunction(idsOrFn)) {
            ids = this.ids.filter((entityId) => idsOrFn(this.entities[entityId]));
        }
        else {
            ids = idPassed ? coerceArray(idsOrFn) : this.ids;
        }
        if (isEmpty(ids))
            return;
        isDev() && setAction('Remove Entity', ids);
        this._setState((state) => removeEntities({ state, ids }));
        if (!idPassed) {
            this.setHasCache(false);
        }
        this.handleUIRemove(ids);
        this.entityActions.next({ type: EntityActions.Remove, ids });
    }
    /**
     *
     * Update the active entity
     *
     * @example
     *
     * this.store.updateActive({ completed: true })
     * this.store.updateActive(active => {
     *   return {
     *     config: {
     *      ..active.config,
     *      date
     *     }
     *   }
     * })
     */
    updateActive(newStateOrCallback) {
        const ids = coerceArray(this.active);
        isDev() && setAction('Update Active', ids);
        this.update(ids, newStateOrCallback);
    }
    setActive(idOrOptions) {
        const active = getActiveEntities(idOrOptions, this.ids, this.active);
        if (active === undefined) {
            return;
        }
        isDev() && setAction('Set Active', active);
        this._setActive(active);
    }
    /**
     * Add active entities
     *
     * @example
     *
     * store.addActive(2);
     * store.addActive([3, 4, 5]);
     */
    addActive(ids) {
        const toArray = coerceArray(ids);
        if (isEmpty(toArray))
            return;
        const everyExist = toArray.every((id) => this.active.indexOf(id) > -1);
        if (everyExist)
            return;
        isDev() && setAction('Add Active', ids);
        this._setState((state) => {
            /** Protect against case that one of the items in the array exist */
            const uniques = Array.from(new Set([...state.active, ...toArray]));
            return {
                ...state,
                active: uniques,
            };
        });
    }
    /**
     * Remove active entities
     *
     * @example
     *
     * store.removeActive(2)
     * store.removeActive([3, 4, 5])
     */
    removeActive(ids) {
        const toArray = coerceArray(ids);
        if (isEmpty(toArray))
            return;
        const someExist = toArray.some((id) => this.active.indexOf(id) > -1);
        if (!someExist)
            return;
        isDev() && setAction('Remove Active', ids);
        this._setState((state) => {
            return {
                ...state,
                active: Array.isArray(state.active) ? state.active.filter((currentId) => toArray.indexOf(currentId) === -1) : null,
            };
        });
    }
    /**
     * Toggle active entities
     *
     * @example
     *
     * store.toggle(2)
     * store.toggle([3, 4, 5])
     */
    toggleActive(ids) {
        const toArray = coerceArray(ids);
        const filterExists = (remove) => (id) => this.active.includes(id) === remove;
        const remove = toArray.filter(filterExists(true));
        const add = toArray.filter(filterExists(false));
        this.removeActive(remove);
        this.addActive(add);
        isDev() && logAction('Toggle Active');
    }
    /**
     *
     * Create sub UI store for managing Entity's UI state
     *
     * @example
     *
     * export type ProductUI = {
     *   isLoading: boolean;
     *   isOpen: boolean
     * }
     *
     * interface ProductsUIState extends EntityState<ProductUI> {}
     *
     * export class ProductsStore EntityStore<ProductsState, Product> {
     *   ui: EntityUIStore<ProductsUIState, ProductUI>;
     *
     *   constructor() {
     *     super();
     *     this.createUIStore();
     *   }
     *
     * }
     */
    createUIStore(initialState = {}, storeConfig = {}) {
        const defaults = { name: `UI/${this.storeName}`, idKey: this.idKey };
        this.ui = new EntityUIStore(initialState, { ...defaults, ...storeConfig });
        return this.ui;
    }
    // @internal
    destroy() {
        super.destroy();
        if (this.ui instanceof EntityStore) {
            this.ui.destroy();
        }
        this.entityActions.complete();
    }
    // @internal
    akitaPreUpdateEntity(_, nextEntity) {
        return nextEntity;
    }
    // @internal
    akitaPreAddEntity(newEntity) {
        return newEntity;
    }
    // @internal
    akitaPreCheckEntity(newEntity) {
        return newEntity;
    }
    get ids() {
        return this._value().ids;
    }
    get entities() {
        return this._value().entities;
    }
    get active() {
        return this._value().active;
    }
    _setActive(ids) {
        this._setState((state) => {
            return {
                ...state,
                active: ids,
            };
        });
    }
    handleUICreation(add = false) {
        const ids = this.ids;
        const isFunc = isFunction(this.ui._akitaCreateEntityFn);
        let uiEntities;
        const createFn = (id) => {
            const current = this.entities[id];
            const ui = isFunc ? this.ui._akitaCreateEntityFn(current) : this.ui._akitaCreateEntityFn;
            return {
                [this.idKey]: current[this.idKey],
                ...ui,
            };
        };
        if (add) {
            uiEntities = this.ids.filter((id) => isUndefined(this.ui.entities[id])).map(createFn);
        }
        else {
            uiEntities = ids.map(createFn);
        }
        add ? this.ui.add(uiEntities) : this.ui.set(uiEntities);
    }
    hasInitialUIState() {
        return this.hasUIStore() && isUndefined(this.ui._akitaCreateEntityFn) === false;
    }
    handleUIRemove(ids) {
        if (this.hasUIStore()) {
            this.ui.remove(ids);
        }
    }
    hasUIStore() {
        return this.ui instanceof EntityUIStore;
    }
}
__decorate([
    transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], EntityStore.prototype, "upsert", null);
__decorate([
    transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof T !== "undefined" && T) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], EntityStore.prototype, "toggleActive", null);
// @internal
export class EntityUIStore extends EntityStore {
    constructor(initialState = {}, storeConfig = {}) {
        super(initialState, storeConfig);
    }
    /**
     *
     * Set the initial UI entity state. This function will determine the entity's
     * initial state when we call `set()` or `add()`.
     *
     * @example
     *
     * constructor() {
     *   super();
     *   this.createUIStore().setInitialEntityState(entity => ({ isLoading: false, isOpen: true }));
     *   this.createUIStore().setInitialEntityState({ isLoading: false, isOpen: true });
     * }
     *
     */
    setInitialEntityState(createFn) {
        this._akitaCreateEntityFn = createFn;
    }
}
//# sourceMappingURL=entityStore.js.map