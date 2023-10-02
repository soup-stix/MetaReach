import { ActiveState, EntityState, ID, IDS, MultiActiveState } from './types';
export declare function hasActiveState<E>(state: EntityState<E>): state is EntityState<E> & (ActiveState | MultiActiveState);
export declare function isMultiActiveState(active: IDS): active is ID[];
export declare function resolveActiveEntity<E>({ active, ids, entities }: EntityState<E> & (ActiveState | MultiActiveState)): ID | ID[];
export declare function getExitingActives(currentActivesIds: ID[], newIds: ID[]): ID[];
