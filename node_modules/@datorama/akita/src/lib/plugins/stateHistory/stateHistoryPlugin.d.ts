import { Observable } from 'rxjs';
import { AkitaPlugin, Queries } from '../plugin';
import { EntityState } from '../../types';
export interface StateHistoryParams {
    maxAge?: number;
    watchProperty?: string;
    comparator?: (prevState: any, currentState: any) => boolean;
}
export declare type History<State> = {
    past: State[];
    present: State | null;
    future: State[];
};
export declare class StateHistoryPlugin<State extends EntityState = any> extends AkitaPlugin<State> {
    protected query: Queries<State>;
    private params;
    private _entityId?;
    /** Allow skipping an update from outside */
    private skip;
    private history;
    /** Skip the update when redo/undo */
    private skipUpdate;
    private subscription;
    private hasPastSubject;
    private _hasPast$;
    private hasFutureSubject;
    private _hasFuture$;
    constructor(query: Queries<State>, params?: StateHistoryParams, _entityId?: any);
    /**
     * Observable stream representing whether the history plugin has an available past
     *
     */
    get hasPast$(): Observable<boolean>;
    /**
     * Observable stream representing whether the history plugin has an available future
     *
     */
    get hasFuture$(): Observable<boolean>;
    get hasPast(): boolean;
    get hasFuture(): boolean;
    private get property();
    private updateHasHistory;
    activate(): void;
    undo(): void;
    redo(): void;
    jumpToPast(index: number): void;
    jumpToFuture(index: number): void;
    /**
     *
     * jump n steps in the past or forward
     *
     */
    jump(n: number): void;
    /**
     * Clear the history
     *
     * @param customUpdateFn Callback function for only clearing part of the history
     *
     * @example
     *
     * stateHistory.clear((history) => {
     *  return {
     *    past: history.past,
     *    present: history.present,
     *    future: []
     *  };
     * });
     */
    clear(customUpdateFn?: (history: History<State>) => History<State>): void;
    destroy(clearHistory?: boolean): void;
    ignoreNext(): void;
    private update;
}
