/**
 * @internal
 *
 * @example
 *
 * getValue(state, 'todos.ui')
 *
 */
export function getValue(obj, prop) {
    /** return the whole state  */
    if (prop.split('.').length === 1) {
        return obj;
    }
    const removeStoreName = prop
        .split('.')
        .slice(1)
        .join('.');
    return removeStoreName.split('.').reduce((acc, part) => acc && acc[part], obj);
}
//# sourceMappingURL=getValueByString.js.map