import { coerceArray } from './coerceArray';
/**
 * Add item to a collection
 *
 * @example
 *
 *
 * store.update(state => ({
 *   comments: arrayAdd(state.comments, { id: 2 })
 * }))
 *
 */
export function arrayAdd(arr, newEntity, options = {}) {
    const newEntities = coerceArray(newEntity);
    const toArr = arr || [];
    return options.prepend ? [...newEntities, ...toArr] : [...toArr, ...newEntities];
}
//# sourceMappingURL=arrayAdd.js.map