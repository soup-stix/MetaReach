import { hasEntity } from './hasEntity';
import { isArray } from './isArray';
// @internal
export function hasActiveState(state) {
    return state.hasOwnProperty('active');
}
// @internal
export function isMultiActiveState(active) {
    return isArray(active);
}
// @internal
export function resolveActiveEntity({ active, ids, entities }) {
    if (isMultiActiveState(active)) {
        return getExitingActives(active, ids);
    }
    if (hasEntity(entities, active) === false) {
        return null;
    }
    return active;
}
// @internal
export function getExitingActives(currentActivesIds, newIds) {
    const filtered = currentActivesIds.filter(id => newIds.indexOf(id) > -1);
    /** Return the same reference if nothing has changed */
    if (filtered.length === currentActivesIds.length) {
        return currentActivesIds;
    }
    return filtered;
}
//# sourceMappingURL=activeState.js.map