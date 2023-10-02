import { Observable } from 'rxjs';
import { QueryEntity } from '../../queryEntity';
import { EntityState, getEntityType, getIDType, OrArray } from '../../types';
import { EntityCollectionPlugin } from '../entityCollectionPlugin';
import { DirtyCheckComparator, DirtyCheckPlugin, DirtyCheckResetParams } from './dirtyCheckPlugin';
export declare type DirtyCheckCollectionParams<State extends EntityState> = {
    comparator?: DirtyCheckComparator<getEntityType<State>>;
    entityIds?: OrArray<getIDType<State>>;
};
export declare class EntityDirtyCheckPlugin<State extends EntityState = any, P extends DirtyCheckPlugin<State> = DirtyCheckPlugin<State>> extends EntityCollectionPlugin<State, P> {
    protected query: QueryEntity<State>;
    private readonly params;
    private _someDirty;
    someDirty$: Observable<boolean>;
    constructor(query: QueryEntity<State>, params?: DirtyCheckCollectionParams<State>);
    setHead(ids?: OrArray<getIDType<State>>): this;
    hasHead(id: getIDType<State>): boolean;
    reset(ids?: OrArray<getIDType<State>>, params?: DirtyCheckResetParams): void;
    isDirty(id: getIDType<State>): Observable<boolean>;
    isDirty(id: getIDType<State>, asObservable: true): Observable<boolean>;
    isDirty(id: getIDType<State>, asObservable: false): boolean;
    someDirty(): boolean;
    isPathDirty(id: getIDType<State>, path: string): boolean;
    destroy(ids?: OrArray<getIDType<State>>): void;
    protected instantiatePlugin(id: getIDType<State>): P;
    private checkSomeDirty;
}
