// @internal
export function not(pred) {
    return function (...args) {
        return !pred(...args);
    };
}
//# sourceMappingURL=not.js.map