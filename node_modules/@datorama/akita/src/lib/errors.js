// @internal
export class AkitaError extends Error {
    constructor(message) {
        super(message);
    }
}
// @internal
export function assertStoreHasName(name, className) {
    if (!name) {
        console.error(`@StoreConfig({ name }) is missing in ${className}`);
    }
}
//# sourceMappingURL=errors.js.map