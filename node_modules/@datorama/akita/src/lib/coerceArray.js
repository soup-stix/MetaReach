import { isNil } from './isNil';
// @internal
export function coerceArray(value) {
    if (isNil(value)) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
}
//# sourceMappingURL=coerceArray.js.map