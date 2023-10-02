import { EntityStore } from './entityStore';
import { Store } from './store';
import { Constructor, EntityState } from './types';
export declare enum StoreAction {
    Update = "UPDATE"
}
export declare enum EntityStoreAction {
    Update = "UPDATE",
    AddEntities = "ADD_ENTITIES",
    SetEntities = "SET_ENTITIES",
    UpdateEntities = "UPDATE_ENTITIES",
    RemoveEntities = "REMOVE_ENTITIES",
    UpsertEntities = "UPSERT_ENTITIES",
    UpsertManyEntities = "UPSERT_MANY_ENTITIES"
}
/**
 * Get a {@link Store} from the global store registry.
 * @param storeClass The {@link Store} class of the instance to be returned.
 */
export declare function getStore<TStore extends Store<S>, S = TStore extends Store<infer T> ? T : never>(storeClass: Constructor<TStore>): TStore;
/**
 * Get a {@link Store} from the global store registry.
 * @param storeName The {@link Store} name of the instance to be returned.
 */
export declare function getStoreByName<TStore extends Store<S>, S = TStore extends Store<infer T> ? T : never>(storeName: string): TStore;
/**
 * Get a {@link EntityStore} from the global store registry.
 * @param storeClass The {@link EntityStore} class of the instance to be returned.
 */
export declare function getEntityStore<TEntityStore extends EntityStore<S>, S extends EntityState = TEntityStore extends EntityStore<infer T> ? T : never>(storeClass: Constructor<TEntityStore>): TEntityStore;
/**
 * Get a {@link EntityStore} from the global store registry.
 * @param storeName The {@link EntityStore} name of the instance to be returned.
 */
export declare function getEntityStoreByName<TEntityStore extends EntityStore<S>, S extends EntityState = TEntityStore extends EntityStore<infer T> ? T : never>(storeName: string): TEntityStore;
/**
 * Run {@link StoreAction.Update} action.
 * @param storeClassOrName The {@link Store} class or name in which the action should be executed.
 * @param action The {@link StoreAction.Update} action, see {@link Store.update}.
 * @param operation The operation to execute the {@link StoreAction.Update} action.
 * @example
 *
 *  runStoreAction(BooksStore, StoreAction.Update, update => update({ filter: 'COMPLETE' }));
 *
 */
export declare function runStoreAction<TStore extends Store<S>, S = TStore extends Store<infer T> ? T : any>(storeClassOrName: Constructor<TStore> | string, action: StoreAction.Update, operation: (operator: TStore['update']) => void): any;
/**
 * Run {@link EntityStoreAction.SetEntities} action.
 * @param storeClassOrName The {@link EntityStore} class or name in which the action should be executed.
 * @param action The {@link EntityStoreAction.SetEntities} action, see {@link EntityStore.set}.
 * @param operation The operation to execute the {@link EntityStoreAction.SetEntities} action.
 * @example
 *
 *  runEntityStoreAction(BooksStore, EntityStoreAction.SetEntities, set => set([{ id: 1 }, { id: 2 }]));
 *
 */
export declare function runEntityStoreAction<TEntityStore extends EntityStore<S>, S extends EntityState = TEntityStore extends EntityStore<infer T> ? T : any>(storeClassOrName: Constructor<TEntityStore> | string, action: EntityStoreAction.SetEntities, operation: (operator: TEntityStore['set']) => void): any;
/**
 * Run {@link EntityStoreAction.AddEntities} action.
 * @param storeClassOrName The {@link EntityStore} class or name in which the action should be executed.
 * @param action The {@link EntityStoreAction.AddEntities} action, see {@link EntityStore.add}.
 * @param operation The operation to execute the {@link EntityStoreAction.AddEntities} action.
 * @example
 *
 *  runEntityStoreAction(BooksStore, EntityStoreAction.AddEntities, add => add({ id: 1 }));
 *
 */
export declare function runEntityStoreAction<TEntityStore extends EntityStore<S>, S extends EntityState = TEntityStore extends EntityStore<infer T> ? T : any>(storeClassOrName: Constructor<TEntityStore> | string, action: EntityStoreAction.AddEntities, operation: (operator: TEntityStore['add']) => void): any;
/**
 * Run {@link EntityStoreAction.UpdateEntities} action.
 * @param storeClassOrName The {@link EntityStore} class or name in which the action should be executed.
 * @param action The {@link EntityStoreAction.UpdateEntities} action, see {@link EntityStore.update}.
 * @param operation The operation to execute the {@link EntityStoreAction.UpdateEntities} action.
 * @example
 *
 *  runEntityStoreAction(BooksStore, EntityStoreAction.UpdateEntities, update => update(2, { title: 'New title' }));
 *
 */
export declare function runEntityStoreAction<TEntityStore extends EntityStore<S>, S extends EntityState = TEntityStore extends EntityStore<infer T> ? T : any>(storeClassOrName: Constructor<TEntityStore> | string, action: EntityStoreAction.UpdateEntities, operation: (operator: TEntityStore['update']) => void): any;
/**
 * Run {@link EntityStoreAction.RemoveEntities} action.
 * @param storeClassOrName The {@link EntityStore} class or name in which the action should be executed.
 * @param action The {@link EntityStoreAction.RemoveEntities} action, see {@link EntityStore.remove}.
 * @param operation The operation to execute the {@link EntityStoreAction.RemoveEntities} action.
 * @example
 *
 *  runEntityStoreAction(BooksStore, EntityStoreAction.RemoveEntities, remove => remove(2));
 *
 */
export declare function runEntityStoreAction<TEntityStore extends EntityStore<S>, S extends EntityState = TEntityStore extends EntityStore<infer T> ? T : any>(storeClassOrName: Constructor<TEntityStore> | string, action: EntityStoreAction.RemoveEntities, operation: (operator: TEntityStore['remove']) => void): any;
/**
 * Run {@link EntityStoreAction.UpsertEntities} action.
 * @param storeClassOrName The {@link EntityStore} class or name in which the action should be executed.
 * @param action The {@link EntityStoreAction.UpsertEntities} action, see {@link EntityStore.upsert}.
 * @param operation The operation to execute the {@link EntityStoreAction.UpsertEntities} action.
 * @example
 *
 *  runEntityStoreAction(BooksStore, EntityStoreAction.UpsertEntities, upsert => upsert([2, 3], { title: 'New Title' }, (id, newState) => ({ id, ...newState, price: 0 })));
 *
 */
export declare function runEntityStoreAction<TEntityStore extends EntityStore<S>, S extends EntityState = TEntityStore extends EntityStore<infer T> ? T : any>(storeClassOrName: Constructor<TEntityStore> | string, action: EntityStoreAction.UpsertEntities, operation: (operator: TEntityStore['upsert']) => void): any;
/**
 * Run {@link EntityStoreAction.UpsertManyEntities} action.
 * @param storeClassOrName The {@link EntityStore} class or name in which the action should be executed.
 * @param action The {@link EntityStoreAction.UpsertManyEntities} action, see {@link EntityStore.upsertMany}.
 * @param operation The operation to execute the {@link EntityStoreAction.UpsertManyEntities} action.
 * @example
 *
 *  runEntityStoreAction(BooksStore, EntityStoreAction.UpsertManyEntities, upsertMany => upsertMany([
 *    { id: 2, title: 'New title', price: 0 },
 *    { id: 4, title: 'Another title', price: 0 },
 *  ));
 */
export declare function runEntityStoreAction<TEntityStore extends EntityStore<S>, S extends EntityState = TEntityStore extends EntityStore<infer T> ? T : any>(storeClassOrName: Constructor<TEntityStore> | string, action: EntityStoreAction.UpsertManyEntities, operation: (operator: TEntityStore['upsertMany']) => void): any;
