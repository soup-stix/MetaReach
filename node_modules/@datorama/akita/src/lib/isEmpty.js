import { isArray } from './isArray';
// @internal
export function isEmpty(arr) {
    if (isArray(arr)) {
        return arr.length === 0;
    }
    return false;
}
//# sourceMappingURL=isEmpty.js.map