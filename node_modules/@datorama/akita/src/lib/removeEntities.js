import { isNil } from './isNil';
import { hasActiveState, isMultiActiveState, resolveActiveEntity } from './activeState';
// @internal
export function removeEntities({ state, ids }) {
    if (isNil(ids))
        return removeAllEntities(state);
    const entities = state.entities;
    let newEntities = {};
    for (const id of state.ids) {
        if (ids.includes(id) === false) {
            newEntities[id] = entities[id];
        }
    }
    const newState = {
        ...state,
        entities: newEntities,
        ids: state.ids.filter(current => ids.includes(current) === false)
    };
    if (hasActiveState(state)) {
        newState.active = resolveActiveEntity(newState);
    }
    return newState;
}
// @internal
export function removeAllEntities(state) {
    return {
        ...state,
        entities: {},
        ids: [],
        active: isMultiActiveState(state.active) ? [] : null
    };
}
//# sourceMappingURL=removeEntities.js.map