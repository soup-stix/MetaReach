import { isBrowser } from './root';
// @internal
export const __stores__ = {};
// @internal
export const __queries__ = {};
if (isBrowser) {
    window.$$stores = __stores__;
    window.$$queries = __queries__;
}
//# sourceMappingURL=stores.js.map