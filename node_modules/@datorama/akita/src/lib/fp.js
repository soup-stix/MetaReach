import { Store } from './store';
import { Query } from './query';
import { EntityStore } from './entityStore';
import { QueryEntity } from './queryEntity';
export function createStore(initialState, options) {
    return new Store(initialState, options);
}
export function createQuery(store) {
    return new Query(store);
}
export function createEntityStore(initialState, options) {
    return new EntityStore(initialState, options);
}
export function createEntityQuery(store, options = {}) {
    return new QueryEntity(store, options);
}
//# sourceMappingURL=fp.js.map