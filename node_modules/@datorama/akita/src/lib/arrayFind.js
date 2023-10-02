import { distinctUntilChanged, map } from 'rxjs';
import { coerceArray } from './coerceArray';
import { DEFAULT_ID_KEY } from './defaultIDKey';
import { isArray } from './isArray';
import { isEmpty } from './isEmpty';
import { isFunction } from './isFunction';
// @internal
export function find(collection, idsOrPredicate, idKey) {
    const result = [];
    if (isFunction(idsOrPredicate)) {
        for (const entity of collection) {
            if (idsOrPredicate(entity) === true) {
                result.push(entity);
            }
        }
    }
    else {
        const toSet = coerceArray(idsOrPredicate).reduce((acc, current) => acc.add(current), new Set());
        for (const entity of collection) {
            if (toSet.has(entity[idKey])) {
                result.push(entity);
            }
        }
    }
    return result;
}
// @internal
export function distinctUntilArrayItemChanged() {
    return distinctUntilChanged((prevCollection, currentCollection) => {
        if (prevCollection === currentCollection) {
            return true;
        }
        if (!isArray(prevCollection) || !isArray(currentCollection)) {
            return false;
        }
        if (isEmpty(prevCollection) && isEmpty(currentCollection)) {
            return true;
        }
        if (prevCollection.length !== currentCollection.length) {
            return false;
        }
        const isOneOfItemReferenceChanged = currentCollection.some((item, i) => {
            return prevCollection[i] !== item;
        });
        // return false means there is a change and we want to call next()
        return isOneOfItemReferenceChanged === false;
    });
}
export function arrayFind(idsOrPredicate, idKey) {
    return function (source) {
        return source.pipe(map((collection) => {
            // which means the user deleted the root entity or set the collection to nil
            if (isArray(collection) === false) {
                return collection;
            }
            return find(collection, idsOrPredicate, idKey || DEFAULT_ID_KEY);
        }), distinctUntilArrayItemChanged(), map((value) => {
            if (isArray(value) === false) {
                return value;
            }
            if (isArray(idsOrPredicate) || isFunction(idsOrPredicate)) {
                return value;
            }
            return value[0];
        }));
    };
}
//# sourceMappingURL=arrayFind.js.map