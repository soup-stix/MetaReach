import { DEFAULT_ID_KEY } from './defaultIDKey';
import { arrayAdd } from './arrayAdd';
import { arrayUpdate } from './arrayUpdate';
import { isObject } from './isObject';
/**
 * Upsert item in a collection
 *
 * @example
 *
 *
 * store.update(1, entity => ({
 *   comments: arrayUpsert(entity.comments, 1, { name: 'newComment' })
 * }))
 */
export function arrayUpsert(arr, id, obj, idKey = DEFAULT_ID_KEY) {
    const entityIsObject = isObject(obj);
    const entityExists = arr.some(entity => (entityIsObject ? entity[idKey] === id : entity === id));
    if (entityExists) {
        return arrayUpdate(arr, id, obj, idKey);
    }
    else {
        return arrayAdd(arr, entityIsObject ? { ...obj, [idKey]: id } : obj);
    }
}
//# sourceMappingURL=arrayUpsert.js.map