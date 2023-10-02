import { toEntitiesObject } from './toEntitiesObject';
import { isArray } from './isArray';
import { hasActiveState, resolveActiveEntity } from './activeState';
// @internal
export function isEntityState(state) {
    return state.entities && state.ids;
}
// @internal
function applyMiddleware(entities, preAddEntity) {
    let mapped = {};
    for (const id of Object.keys(entities)) {
        mapped[id] = preAddEntity(entities[id]);
    }
    return mapped;
}
// @internal
export function setEntities({ state, entities, idKey, preAddEntity, isNativePreAdd }) {
    let newEntities;
    let newIds;
    if (isArray(entities)) {
        const resolve = toEntitiesObject(entities, idKey, preAddEntity);
        newEntities = resolve.entities;
        newIds = resolve.ids;
    }
    else if (isEntityState(entities)) {
        newEntities = isNativePreAdd ? entities.entities : applyMiddleware(entities.entities, preAddEntity);
        newIds = entities.ids;
    }
    else {
        // it's an object
        newEntities = isNativePreAdd ? entities : applyMiddleware(entities, preAddEntity);
        newIds = Object.keys(newEntities).map(id => (isNaN(id) ? id : Number(id)));
    }
    const newState = {
        ...state,
        entities: newEntities,
        ids: newIds,
        loading: false
    };
    if (hasActiveState(state)) {
        newState.active = resolveActiveEntity(newState);
    }
    return newState;
}
//# sourceMappingURL=setEntities.js.map