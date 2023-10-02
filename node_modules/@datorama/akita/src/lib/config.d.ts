export interface AkitaConfig {
    /**
     * Whether to allowed the reset() stores functionality
     */
    resettable?: boolean;
    ttl?: number;
    producerFn?: (state: any, fn: any) => any;
}
export declare function akitaConfig(config: AkitaConfig): void;
export declare function getAkitaConfig(): AkitaConfig;
export declare function getGlobalProducerFn(): (state: any, fn: any) => any;
