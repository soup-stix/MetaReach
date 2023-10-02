export const queryConfigKey = 'akitaQueryConfig';
export function QueryConfig(metadata) {
    return function (constructor) {
        constructor[queryConfigKey] = {};
        for (let i = 0, keys = Object.keys(metadata); i < keys.length; i++) {
            const key = keys[i];
            constructor[queryConfigKey][key] = metadata[key];
        }
    };
}
//# sourceMappingURL=queryConfig.js.map