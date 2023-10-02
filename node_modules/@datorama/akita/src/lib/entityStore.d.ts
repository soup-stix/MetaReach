import { AddEntitiesOptions } from './addEntities';
import { EntityAction } from './entityActions';
import { SetActiveOptions } from './getActiveEntities';
import { SetEntities } from './setEntities';
import { Store } from './store';
import { StoreConfigOptions } from './storeConfig';
import { Constructor, CreateStateCallback, EntityState, EntityUICreateFn, getEntityType, getIDType, IDS, OrArray, UpdateEntityPredicate, UpdateStateCallback, UpsertStateCallback } from './types';
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
export declare class EntityStore<S extends EntityState = any, EntityType = getEntityType<S>, IDType = getIDType<S>> extends Store<S> {
    protected options: Partial<StoreConfigOptions>;
    ui: EntityUIStore<any, EntityType>;
    private entityActions;
    private entityIdChanges;
    constructor(initialState?: Partial<S>, options?: Partial<StoreConfigOptions>);
    get selectEntityAction$(): import("rxjs").Observable<EntityAction<IDType>>;
    get selectEntityIdChanges$(): import("rxjs").Observable<{
        newId: IDType;
        oldId: IDType;
        pending: boolean;
    }>;
    get idKey(): string;
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
    set(entities: SetEntities<EntityType>, options?: {
        activeId?: IDType | null;
    }): void;
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
    add(entities: OrArray<EntityType>, options?: AddEntitiesOptions): void;
    /**
     *
     * Update entities
     *
     * @example
     *
     * store.update(1, entity => ...)
     * store.update([1, 2, 3], entity => ...)
     * store.update(null, entity => ...)
     */
    update(id: OrArray<IDType> | null, newStateFn: UpdateStateCallback<EntityType>): any;
    /**
     * store.update(1, { name: newName })
     */
    update(id: OrArray<IDType> | null, newState: Partial<EntityType>): any;
    /**
     * store.update(entity => entity.price > 3, entity => ({ name: newName }))
     */
    update(predicate: UpdateEntityPredicate<EntityType>, newStateFn: UpdateStateCallback<EntityType>): any;
    /**
     * store.update(entity => entity.price > 3, { name: newName })
     */
    update(predicate: UpdateEntityPredicate<EntityType>, newState: Partial<EntityType>): any;
    /** Support non-entity updates */
    update(newState: UpdateStateCallback<S>): any;
    update(newState: Partial<S>): any;
    /**
     *
     * Create or update.
     *
     * Warning: By omitting the initializing callback parameter onCreate(), the type safety of entities cannot be guaranteed.
     *
     * @example
     *
     * store.upsert(1, { active: true });
     * store.upsert([2, 3], { active: true });
     * store.upsert([2, 3], entity => ({ isOpen: !(entity?.isOpen ?? true) }))
     *
     */
    upsert<NewEntityType extends Partial<EntityType>>(ids: OrArray<IDType>, newState: UpsertStateCallback<EntityType, NewEntityType> | NewEntityType, options?: {
        baseClass?: Constructor;
    }): void;
    /**
     *
     * Create or update
     *
     * @example
     *
     * store.upsert(1, { active: true }, (id, newState) => ({ id, ...newState, enabled: true }));
     * store.upsert([2, 3], { active: true }, (id, newState) => ({ id, ...newState, enabled: true }));
     * store.upsert([2, 3], entity => ({ isOpen: !(entity?.isOpen ?? true) }), (id, newState) => ({ id, ...newState, enabled: true }));
     *
     */
    upsert<NewEntityType extends Partial<EntityType>>(ids: OrArray<IDType>, newState: UpsertStateCallback<EntityType, NewEntityType> | NewEntityType, onCreate: CreateStateCallback<EntityType, NewEntityType, IDType>, options?: {
        baseClass?: Constructor;
    }): void;
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
    upsertMany(entities: EntityType[], options?: {
        baseClass?: Constructor;
        loading?: boolean;
    }): void;
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
    replace(ids: IDS, newState: Partial<EntityType>): void;
    /**
     *
     * Move entity inside the collection
     *
     *
     * @example
     *
     * this.store.move(fromIndex, toIndex)
     */
    move(from: number, to: number): void;
    /**
     *
     * Remove one or more entities
     *
     * @example
     *
     * this.store.remove(5)
     * this.store.remove([1,2,3])
     * this.store.remove()
     */
    remove(id?: OrArray<IDType>): any;
    /**
     * this.store.remove(entity => entity.id === 1)
     */
    remove(predicate: (entity: Readonly<EntityType>) => boolean): any;
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
    updateActive(newStateOrCallback: UpdateStateCallback<EntityType> | Partial<EntityType>): void;
    /**
     * Set the given entity as active
     *
     * @example
     *
     * store.setActive(1)
     * store.setActive([1, 2, 3])
     */
    setActive(idOrOptions: S['active'] extends any[] ? S['active'] : SetActiveOptions | S['active']): any;
    /**
     * Add active entities
     *
     * @example
     *
     * store.addActive(2);
     * store.addActive([3, 4, 5]);
     */
    addActive<T = OrArray<IDType>>(ids: T): void;
    /**
     * Remove active entities
     *
     * @example
     *
     * store.removeActive(2)
     * store.removeActive([3, 4, 5])
     */
    removeActive<T = OrArray<IDType>>(ids: T): void;
    /**
     * Toggle active entities
     *
     * @example
     *
     * store.toggle(2)
     * store.toggle([3, 4, 5])
     */
    toggleActive<T = OrArray<IDType>>(ids: T): void;
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
    createUIStore(initialState?: {}, storeConfig?: Partial<StoreConfigOptions>): EntityUIStore<any, EntityType>;
    destroy(): void;
    akitaPreUpdateEntity(_: Readonly<EntityType>, nextEntity: any): EntityType;
    akitaPreAddEntity(newEntity: any): EntityType;
    akitaPreCheckEntity(newEntity: Readonly<EntityType>): EntityType;
    private get ids();
    private get entities();
    private get active();
    private _setActive;
    private handleUICreation;
    private hasInitialUIState;
    private handleUIRemove;
    private hasUIStore;
}
export declare class EntityUIStore<UIState extends EntityState, DEPRECATED = any> extends EntityStore<UIState> {
    _akitaCreateEntityFn: EntityUICreateFn;
    constructor(initialState?: {}, storeConfig?: Partial<StoreConfigOptions>);
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
    setInitialEntityState<EntityUI = any, Entity = any>(createFn: EntityUICreateFn<EntityUI, Entity>): void;
}
