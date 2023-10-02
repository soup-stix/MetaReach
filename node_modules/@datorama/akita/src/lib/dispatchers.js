import { ReplaySubject, Subject } from 'rxjs';
// @internal
export const $$deleteStore = new Subject();
// @internal
export const $$addStore = new ReplaySubject(50, 5000);
// @internal
export const $$updateStore = new Subject();
// @internal
export function dispatchDeleted(storeName) {
    $$deleteStore.next(storeName);
}
// @internal
export function dispatchAdded(storeName) {
    $$addStore.next(storeName);
}
// @internal
export function dispatchUpdate(storeName, action) {
    $$updateStore.next({ storeName, action });
}
//# sourceMappingURL=dispatchers.js.map