import { isObject } from './isObject';
/**
 * @internal
 *
 * @example
 * setValue(state, 'todos.ui', { filter: {} })
 */
export function setValue(obj, prop, val, replace = false) {
    const split = prop.split('.');
    if (split.length === 1) {
        return { ...obj, ...val };
    }
    obj = { ...obj };
    const lastIndex = split.length - 2;
    const removeStoreName = prop.split('.').slice(1);
    removeStoreName.reduce((acc, part, index) => {
        if (index !== lastIndex) {
            acc[part] = { ...acc[part] };
            return acc && acc[part];
        }
        acc[part] = replace || Array.isArray(acc[part]) || !isObject(acc[part]) ? val : { ...acc[part], ...val };
        return acc && acc[part];
    }, obj);
    return obj;
}
//# sourceMappingURL=setValueByString.js.map