// @internal
export function mapSkipUndefined(arr, callbackFn) {
    return arr.reduce((result, value, index, array) => {
        const val = callbackFn(value, index, array);
        if (val !== undefined) {
            result.push(val);
        }
        return result;
    }, []);
}
//# sourceMappingURL=mapSkipUndefined.js.map