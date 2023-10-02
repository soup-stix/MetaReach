import { IDS } from './types';
export interface StoreSnapshotAction {
    type: string | null;
    entityIds: IDS[] | null;
    skip: boolean;
    payload: any;
}
export declare const currentAction: StoreSnapshotAction;
export declare function resetCustomAction(): void;
export declare function logAction(type: string, entityIds?: any, payload?: any): void;
export declare function setAction(type: string, entityIds?: any, payload?: any): void;
export declare function setSkipAction(skip?: boolean): void;
export declare function action(action: string, entityIds?: any): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
