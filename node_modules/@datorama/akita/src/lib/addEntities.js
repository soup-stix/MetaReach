import { hasEntity } from './hasEntity';
// @internal
export function addEntities({ state, entities, idKey, options = {}, preAddEntity }) {
    let newEntities = {};
    let newIds = [];
    let hasNewEntities = false;
    for (const entity of entities) {
        if (hasEntity(state.entities, entity[idKey]) === false) {
            // evaluate the middleware first to support dynamic ids
            const current = preAddEntity(entity);
            const entityId = current[idKey];
            newEntities[entityId] = current;
            if (options.prepend)
                newIds.unshift(entityId);
            else
                newIds.push(entityId);
            hasNewEntities = true;
        }
    }
    return hasNewEntities
        ? {
            newState: {
                ...state,
                entities: {
                    ...state.entities,
                    ...newEntities
                },
                ids: options.prepend ? [...newIds, ...state.ids] : [...state.ids, ...newIds]
            },
            newIds
        }
        : null;
}
//# sourceMappingURL=addEntities.js.map