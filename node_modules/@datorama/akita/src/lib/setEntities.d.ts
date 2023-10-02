import { Entities, EntityState, HashMap, PreAddEntity } from './types';
export declare type SetEntities<Entity> = Entity[] | Entities<Entity> | HashMap<Entity>;
export declare type SetEntitiesParams<State, Entity> = {
    state: State;
    entities: SetEntities<Entity>;
    idKey: string;
    preAddEntity: PreAddEntity<Entity>;
    isNativePreAdd?: boolean;
};
export declare function isEntityState<Entity>(state: any): state is Entities<Entity>;
export declare function setEntities<S extends EntityState<E>, E>({ state, entities, idKey, preAddEntity, isNativePreAdd }: SetEntitiesParams<S, E>): S;
