import { AkitaConfig } from './config';
export declare type StoreConfigOptions = {
    name: string;
    resettable?: AkitaConfig['resettable'];
    cache?: {
        ttl: number;
    };
    deepFreezeFn?: (o: any) => any;
    idKey?: string;
    producerFn?: AkitaConfig['producerFn'];
};
export declare type UpdatableStoreConfigOptions = {
    cache?: {
        ttl: number;
    };
};
export declare const configKey = "akitaConfig";
export declare function StoreConfig(metadata: StoreConfigOptions): (constructor: Function) => void;
