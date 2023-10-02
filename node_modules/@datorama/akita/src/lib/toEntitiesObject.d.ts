import { PreAddEntity } from './types';
export declare function toEntitiesObject<E>(entities: E[], idKey: string, preAddEntity: PreAddEntity<E>): {
    entities: {};
    ids: any[];
};
