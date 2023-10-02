import { EntityState, PreUpdateEntity, UpdateStateCallback } from './types';
export declare type UpdateEntitiesParams<State, Entity> = {
    state: State;
    ids: any[];
    idKey: string;
    newStateOrFn: UpdateStateCallback<Entity> | Partial<Entity> | Partial<State>;
    preUpdateEntity: PreUpdateEntity<Entity>;
    producerFn: any;
    onEntityIdChanges: (oldId: any, newId: any) => void;
};
export declare function updateEntities<S extends EntityState<E>, E>({ state, ids, idKey, newStateOrFn, preUpdateEntity, producerFn, onEntityIdChanges }: UpdateEntitiesParams<S, E>): S & {
    entities: {};
    ids: any[];
};
