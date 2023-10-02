import { QueryEntity } from '../../queryEntity';
import { EntityState, getIDType, OrArray } from '../../types';
import { EntityCollectionPlugin } from '../entityCollectionPlugin';
import { History, StateHistoryParams, StateHistoryPlugin } from './stateHistoryPlugin';
export interface StateHistoryEntityParams<IDType> extends StateHistoryParams {
    entityIds?: OrArray<IDType>;
}
export declare class EntityStateHistoryPlugin<State extends EntityState = any, P extends StateHistoryPlugin<State> = StateHistoryPlugin<State>> extends EntityCollectionPlugin<State, P> {
    protected query: QueryEntity<State>;
    protected readonly params: StateHistoryEntityParams<getIDType<State>>;
    constructor(query: QueryEntity<State>, params?: StateHistoryEntityParams<getIDType<State>>);
    redo(ids?: OrArray<getIDType<State>>): void;
    undo(ids?: OrArray<getIDType<State>>): void;
    hasPast(id: getIDType<State>): boolean;
    hasFuture(id: getIDType<State>): boolean;
    jumpToFuture(ids: OrArray<getIDType<State>>, index: number): void;
    jumpToPast(ids: OrArray<getIDType<State>>, index: number): void;
    clear(ids?: OrArray<getIDType<State>>, customUpdateFn?: (history: History<State>) => History<State>): void;
    destroy(ids?: OrArray<getIDType<State>>, clearHistory?: boolean): void;
    ignoreNext(ids?: OrArray<getIDType<State>>): void;
    protected instantiatePlugin(id: getIDType<State>): P;
}
