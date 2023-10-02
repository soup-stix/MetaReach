import { EntityState, PreAddEntity } from './types';
export declare type AddEntitiesParams<State, Entity> = {
    state: State;
    entities: Entity[];
    idKey: string;
    options: AddEntitiesOptions;
    preAddEntity: PreAddEntity<Entity>;
};
export declare type AddEntitiesOptions = {
    prepend?: boolean;
    loading?: boolean;
};
export declare function addEntities<S extends EntityState<E>, E>({ state, entities, idKey, options, preAddEntity }: AddEntitiesParams<S, E>): {
    newState: S & {
        entities: {};
        ids: any[];
    };
    newIds: any[];
};
