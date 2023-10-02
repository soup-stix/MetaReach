import { Observable } from 'rxjs';
import { EntityAction, EntityActions } from './entityActions';
import { EntityStore } from './entityStore';
import { Query } from './query';
import { QueryConfigOptions } from './queryConfig';
import { SelectAllOptionsA, SelectAllOptionsB, SelectAllOptionsC, SelectAllOptionsD, SelectAllOptionsE } from './selectAllOverloads';
import { EntityState, getEntityType, getIDType, HashMap, ItemPredicate } from './types';
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
export declare class QueryEntity<S extends EntityState, EntityType = getEntityType<S>, IDType = getIDType<S>> extends Query<S> {
    private options;
    ui: EntityUIQuery<any, EntityType>;
    protected store: EntityStore<S>;
    __store__: any;
    constructor(store: EntityStore<S>, options?: QueryConfigOptions);
    /**
     * Select the entire store's entity collection
     *
     * @example
     *
     * this.query.selectAll()
     *
     * this.query.selectAll({
     *   limitTo: 5
     *   filterBy: entity => entity.completed === true
     * })
     *
     * this.query.selectAll({
     *   asObject: true,
     *   limitTo: 3
     * })
     *
     *  this.query.selectAll({
     *   sortBy: 'price',
     *   sortByOrder: Order.DESC
     * })
     *
     */
    selectAll(options: SelectAllOptionsA<EntityType>): Observable<HashMap<EntityType>>;
    selectAll(options: SelectAllOptionsB<EntityType>): Observable<EntityType[]>;
    selectAll(options: SelectAllOptionsC<EntityType>): Observable<HashMap<EntityType>>;
    selectAll(options: SelectAllOptionsD<EntityType>): Observable<EntityType[]>;
    selectAll(options: SelectAllOptionsE<EntityType>): Observable<EntityType[]>;
    selectAll(): Observable<EntityType[]>;
    /**
     * Get the entire store's entity collection
     *
     * @example
     *
     * this.query.getAll()
     *
     * this.query.getAll({
     *   limitTo: 5
     *   filterBy: entity => entity.completed === true
     * })
     *
     * this.query.getAll({
     *   asObject: true,
     *   limitTo: 3
     * })
     *
     *  this.query.getAll({
     *   sortBy: 'price',
     *   sortByOrder: Order.DESC
     * })
     */
    getAll(options: SelectAllOptionsA<EntityType>): HashMap<EntityType>;
    getAll(options: SelectAllOptionsB<EntityType>): EntityType[];
    getAll(options: SelectAllOptionsC<EntityType>): HashMap<EntityType>;
    getAll(options: SelectAllOptionsD<EntityType>): EntityType[];
    getAll(options: SelectAllOptionsE<EntityType>): EntityType[];
    getAll(): EntityType[];
    /**
     * Select multiple entities from the store
     *
     * @example
     *
     * this.query.selectMany([1,2,3])
     * this.query.selectMany([1,2], entity => entity.title)
     */
    selectMany<R>(ids: IDType[]): Observable<EntityType[]>;
    selectMany<R>(ids: IDType[], project: (entity: EntityType) => R): Observable<R[]>;
    /**
     * Select an entity or a slice of an entity
     *
     * @example
     *
     * this.query.selectEntity(1)
     * this.query.selectEntity(1, entity => entity.config.date)
     * this.query.selectEntity(1, 'comments')
     * this.query.selectEntity(e => e.title === 'title')
     *
     */
    selectEntity<R>(id: IDType): Observable<EntityType | undefined>;
    selectEntity<K extends keyof EntityType>(id: IDType, project?: K): Observable<EntityType[K] | undefined>;
    selectEntity<R>(id: IDType, project: (entity?: EntityType) => R): Observable<R>;
    selectEntity<R>(predicate: ItemPredicate<EntityType>): Observable<EntityType | undefined>;
    /**
     * Get an entity by id
     *
     * @example
     *
     * this.query.getEntity(1);
     */
    getEntity(id: IDType): EntityType | undefined;
    /**
     * Select the active entity's id
     *
     * @example
     *
     * this.query.selectActiveId()
     */
    selectActiveId(): Observable<S['active'] | undefined>;
    /**
     * Get the active id
     *
     * @example
     *
     * this.query.getActiveId()
     */
    getActiveId(): S['active'] | undefined;
    /**
     * Select the active entity
     *
     * @example
     *
     * this.query.selectActive()
     * this.query.selectActive(entity => entity.title)
     */
    selectActive<R>(): S['active'] extends any[] ? Observable<EntityType[]> : Observable<EntityType | undefined>;
    selectActive<R>(project?: (entity: EntityType) => R): S['active'] extends any[] ? Observable<R[]> : Observable<R | undefined>;
    /**
     * Get the active entity
     *
     * @example
     *
     * this.query.getActive()
     */
    getActive(): S['active'] extends any[] ? EntityType[] : EntityType | undefined;
    /**
     * Select the store's entity collection length
     *
     * @example
     *
     * this.query.selectCount()
     * this.query.selectCount(entity => entity.completed)
     */
    selectCount(predicate?: (entity: EntityType, index: number) => boolean): Observable<number>;
    /**
     * Get the store's entity collection length
     *
     * @example
     *
     * this.query.getCount()
     * this.query.getCount(entity => entity.completed)
     */
    getCount(predicate?: (entity: EntityType, index: number) => boolean): number;
    /**
     *
     * Select the last entity from the store
     *
     * @example
     *
     * this.query.selectLast()
     * this.query.selectLast(todo => todo.title)
     */
    selectLast<R>(): Observable<EntityType | undefined>;
    selectLast<R>(project: (entity?: EntityType) => R): Observable<R>;
    /**
     *
     * Select the first entity from the store
     *
     * @example
     *
     * this.query.selectFirst()
     * this.query.selectFirst(todo => todo.title)
     */
    selectFirst<R>(): Observable<EntityType | undefined>;
    selectFirst<R>(project: (entity?: EntityType) => R): Observable<R>;
    /**
     *
     * Listen for entity actions
     *
     *  @example
     *  this.query.selectEntityAction(EntityActions.Add);
     *  this.query.selectEntityAction(EntityActions.Update);
     *  this.query.selectEntityAction(EntityActions.Remove);
     *
     *  this.query.selectEntityAction([EntityActions.Add, EntityActions.Update, EntityActions.Remove])
     *
     *  this.query.selectEntityAction();
     */
    selectEntityAction(action: EntityActions): Observable<IDType[]>;
    selectEntityAction(actions: EntityActions[]): Observable<EntityAction<IDType>>;
    selectEntityAction(): Observable<EntityAction<IDType>>;
    /**
     * Returns whether entity exists
     *
     * @example
     *
     * this.query.hasEntity(2)
     * this.query.hasEntity(entity => entity.completed)
     * this.query.hasEntity([1, 2, 33])
     *
     */
    hasEntity(id: IDType): boolean;
    hasEntity(id: IDType[]): boolean;
    hasEntity(project: (entity: EntityType) => boolean): boolean;
    hasEntity(): boolean;
    /**
     * Returns whether entity store has an active entity
     *
     * @example
     *
     * this.query.hasActive()
     * this.query.hasActive(3)
     *
     */
    hasActive(id?: IDType): boolean;
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
    createUIQuery(): void;
    private selectAt;
}
export declare class EntityUIQuery<UIState extends EntityState, DEPRECATED = any> extends QueryEntity<UIState> {
    constructor(store: any);
}
