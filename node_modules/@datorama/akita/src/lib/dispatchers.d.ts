import { ReplaySubject, Subject } from 'rxjs';
import { StoreSnapshotAction } from './actions';
export declare const $$deleteStore: Subject<string>;
export declare const $$addStore: ReplaySubject<string>;
export declare const $$updateStore: Subject<{
    storeName: string;
    action: StoreSnapshotAction;
}>;
export declare function dispatchDeleted(storeName: string): void;
export declare function dispatchAdded(storeName: string): void;
export declare function dispatchUpdate(storeName: string, action: StoreSnapshotAction): void;
