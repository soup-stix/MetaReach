import { DEFAULT_ID_KEY } from './defaultIDKey';
// @internal
export function toEntitiesIds(entities, idKey = DEFAULT_ID_KEY) {
    const ids = [];
    for (const entity of entities) {
        ids.push(entity[idKey]);
    }
    return ids;
}
//# sourceMappingURL=toEntitiesIds.js.map