let CONFIG = {
    resettable: false,
    ttl: null,
    producerFn: undefined
};
export function akitaConfig(config) {
    CONFIG = { ...CONFIG, ...config };
}
// @internal
export function getAkitaConfig() {
    return CONFIG;
}
export function getGlobalProducerFn() {
    return CONFIG.producerFn;
}
//# sourceMappingURL=config.js.map