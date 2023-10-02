import { isBrowser } from './root';
export let __DEV__ = true;
export function enableAkitaProdMode() {
    __DEV__ = false;
    if (isBrowser) {
        delete window.$$stores;
        delete window.$$queries;
    }
}
// @internal
export function isDev() {
    return __DEV__;
}
//# sourceMappingURL=env.js.map