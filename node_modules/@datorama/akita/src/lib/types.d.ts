import { SortByOptions } from './queryConfig';
import { BehaviorSubject, Observable } from 'rxjs';
import { QueryEntity } from './queryEntity';
export interface HashMap<T> {
    [id: string]: T;
}
export interface EntityState<E = any, IDType = any> {
    entities?: HashMap<E>;
    ids?: IDType[];
    loading?: boolean;
    error?: any;
    [key: string]: any;
}
export interface Entities<E> {
    entities: HashMap<E>;
    ids: ID[];
}
export interface ActiveState<T = ID> {
    active: T | null;
}
export interface MultiActiveState<T = ID> {
    active: T[];
}
export interface SelectOptions<E> extends SortByOptions<E> {
    asObject?: boolean;
    filterBy?: ((entity: E, index?: number) => boolean) | ((entity: E, index?: number) => boolean)[] | undefined;
    limitTo?: number;
}
export declare type StateWithActive<State> = State & (ActiveState | MultiActiveState);
export declare type UpdateStateCallback<State, NewState extends Partial<State> = Partial<State>> = (state: State) => NewState | void;
export declare type UpsertStateCallback<State, NewState extends Partial<State> = Partial<State>> = (state: State | {}) => NewState;
export declare type CreateStateCallback<State, NewState extends Partial<State>, IDType> = (id: IDType, newState: NewState) => State;
export declare type UpdateEntityPredicate<E> = (entity: E) => boolean;
export declare type ID = number | string;
export declare type IDS = ID | ID[];
export declare type PreAddEntity<Entity> = (entity: Entity) => Entity;
export declare type PreUpdateEntity<Entity> = (prevEntity: Entity, nextEntity: Entity) => Entity;
export declare type StoreCache = {
    active: BehaviorSubject<boolean>;
    ttl: number;
};
export declare type ArrayProperties<T> = {
    [K in keyof T]: T[K] extends any[] ? K : never;
}[keyof T];
export declare type ItemPredicate<Item = any> = (item: Item, index?: number) => boolean;
export declare type MaybeAsync<T = any> = Promise<T> | Observable<T> | T;
export declare type EntityUICreateFn<EntityUI = any, Entity = any> = EntityUI | ((entity: Entity) => EntityUI);
export declare type Constructor<T = any> = new (...args: any[]) => T;
export declare type OrArray<Type> = Type | Type[];
export declare type getEntityType<S> = S extends EntityState<infer I> ? I : never;
export declare type getIDType<S> = S extends EntityState<any, infer I> ? I : never;
export declare type getQueryEntityState<T extends QueryEntity<any>> = T extends QueryEntity<infer S> ? S : never;
export declare type ArrayFuncs = ((...a: any[]) => any)[];
export declare type ReturnTypes<T extends ArrayFuncs> = {
    [P in keyof T]: T[P] extends (...a: any[]) => infer R ? R : never;
};
