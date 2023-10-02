export declare class SnapshotManager {
    /**
     * Get a snapshot of the whole state or a specific stores
     * Use it ONLY for things such as saving the state in the server
     */
    getStoresSnapshot(stores?: string[]): {};
    setStoresSnapshot(stores: {
        [storeName: string]: any;
    } | string, options?: {
        skipStorageUpdate?: boolean;
        lazy?: boolean;
    }): void;
}
export declare const snapshotManager: SnapshotManager;
