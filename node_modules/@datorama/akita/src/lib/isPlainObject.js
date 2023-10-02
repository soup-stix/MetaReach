import { toBoolean } from './toBoolean';
// @internal
export function isPlainObject(value) {
    return toBoolean(value) && value.constructor.name === 'Object';
}
//# sourceMappingURL=isPlainObject.js.map