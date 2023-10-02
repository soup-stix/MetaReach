import { isArray } from './isArray';
// @internal
export function isNumber(value) {
    return !isArray(value) && value - parseFloat(value) + 1 >= 0;
}
//# sourceMappingURL=isNumber.js.map