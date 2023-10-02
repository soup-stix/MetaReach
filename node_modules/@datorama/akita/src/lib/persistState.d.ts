import { OperatorFunction } from 'rxjs';
import { MaybeAsync } from './types';
export declare function selectPersistStateInit(): import("rxjs").Observable<unknown>;
export declare function setSkipStorageUpdate(skip: boolean): void;
export declare function getSkipStorageUpdate(): boolean;
export interface PersistStateStorage {
    getItem(key: string): MaybeAsync;
    setItem(key: string, value: any): MaybeAsync;
    clear(): void;
}
export declare type PersistStateSelectFn<T = any> = ((store: T) => Partial<T>) & {
    storeName: string;
};
export interface PersistStateParams {
    /** The storage key */
    key: string;
    /** Whether to enable persistState in a non-browser environment */
    enableInNonBrowser: boolean;
    /** Storage strategy to use. This defaults to LocalStorage but you can pass SessionStorage or anything that implements the StorageEngine API. */
    storage: PersistStateStorage;
    /** Custom deserializer. Defaults to JSON.parse */
    deserialize: Function;
    /** Custom serializer, defaults to JSON.stringify */
    serialize: Function;
    /** By default the whole state is saved to storage, use this param to include only the stores you need. */
    include: (string | ((storeName: string) => boolean))[];
    /** By default the whole state is saved to storage, use this param to include only the data you need. */
    select: PersistStateSelectFn[];
    preStorageUpdate(storeName: string, state: any): any;
    preStoreUpdate(storeName: string, state: any, initialState: any): any;
    skipStorageUpdate: () => boolean;
    preStorageUpdateOperator: () => OperatorFunction<any, any>;
    /** Whether to persist a dynamic store upon destroy */
    persistOnDestroy: boolean;
}
export interface PersistState {
    destroy(): void;
    /**
     * @deprecated Use clearStore instead.
     */
    clear(): void;
    clearStore(storeName?: string): void;
}
export declare function persistState(params?: Partial<PersistStateParams>): PersistState;
