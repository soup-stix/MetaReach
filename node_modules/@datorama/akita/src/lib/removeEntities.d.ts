import { EntityState, StateWithActive } from './types';
export declare type RemoveEntitiesParams<State, Entity> = {
    state: StateWithActive<State>;
    ids: any[];
};
export declare function removeEntities<S extends EntityState<E>, E>({ state, ids }: RemoveEntitiesParams<S, E>): S;
export declare function removeAllEntities<S>(state: StateWithActive<S>): S;
