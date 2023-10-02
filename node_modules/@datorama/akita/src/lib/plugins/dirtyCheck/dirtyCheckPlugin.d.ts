import { Observable } from 'rxjs';
import { AkitaPlugin, Queries } from '../plugin';
import { EntityState } from '../../types';
export declare type DirtyCheckComparator<State> = (head: State, current: State) => boolean;
export declare type DirtyCheckParams<StoreState = any> = {
    comparator?: DirtyCheckComparator<StoreState>;
    watchProperty?: keyof StoreState | (keyof StoreState)[];
};
export declare const dirtyCheckDefaultParams: {
    comparator: (head: any, current: any) => boolean;
};
export declare function getNestedPath(nestedObj: any, path: string): any;
export declare type DirtyCheckResetParams<StoreState = any> = {
    updateFn?: StoreState | ((head: StoreState, current: StoreState) => any);
};
export declare class DirtyCheckPlugin<State extends EntityState = any> extends AkitaPlugin<State> {
    protected query: Queries<State>;
    private params?;
    private _entityId?;
    private head;
    private dirty;
    private subscription;
    private active;
    private _reset;
    isDirty$: Observable<boolean>;
    reset$: Observable<unknown>;
    constructor(query: Queries<State>, params?: DirtyCheckParams<State>, _entityId?: any);
    reset(params?: DirtyCheckResetParams): void;
    setHead(): DirtyCheckPlugin<State>;
    isDirty(): boolean;
    hasHead(): boolean;
    destroy(): void;
    isPathDirty(path: string): boolean;
    getHead(): Partial<State> | State | undefined | null;
    private activate;
    private updateDirtiness;
    private _getHead;
    private getWatchedValues;
}
