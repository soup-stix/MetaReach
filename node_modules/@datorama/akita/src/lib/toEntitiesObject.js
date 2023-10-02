// @internal
export function toEntitiesObject(entities, idKey, preAddEntity) {
    const acc = {
        entities: {},
        ids: []
    };
    for (const entity of entities) {
        // evaluate the middleware first to support dynamic ids
        const current = preAddEntity(entity);
        acc.entities[current[idKey]] = current;
        acc.ids.push(current[idKey]);
    }
    return acc;
}
//# sourceMappingURL=toEntitiesObject.js.map