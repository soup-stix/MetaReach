import { ID, IDS } from './types';
export declare type SetActiveOptions = {
    prev?: boolean;
    next?: boolean;
    wrap?: boolean;
};
export declare function getActiveEntities(idOrOptions: IDS | SetActiveOptions | null, ids: ID[], currentActive: IDS | null): any;
