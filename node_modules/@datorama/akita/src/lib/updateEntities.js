import { isFunction } from './isFunction';
import { hasEntity } from './hasEntity';
import { isPlainObject } from './isPlainObject';
// @internal
export function updateEntities({ state, ids, idKey, newStateOrFn, preUpdateEntity, producerFn, onEntityIdChanges }) {
    const updatedEntities = {};
    let isUpdatingIdKey = false;
    let idToUpdate;
    for (const id of ids) {
        // if the entity doesn't exist don't do anything
        if (hasEntity(state.entities, id) === false) {
            continue;
        }
        const oldEntity = state.entities[id];
        let newState;
        if (isFunction(newStateOrFn)) {
            newState = isFunction(producerFn) ? producerFn(oldEntity, newStateOrFn) : newStateOrFn(oldEntity);
        }
        else {
            newState = newStateOrFn;
        }
        const isIdChanged = newState.hasOwnProperty(idKey) && newState[idKey] !== oldEntity[idKey];
        let newEntity;
        idToUpdate = id;
        if (isIdChanged) {
            isUpdatingIdKey = true;
            idToUpdate = newState[idKey];
        }
        const merged = {
            ...oldEntity,
            ...newState,
        };
        if (isPlainObject(oldEntity)) {
            newEntity = merged;
        }
        else {
            /**
             * In case that new state is class of it's own, there's
             * a possibility that it will be different than the old
             * class.
             * For example, Old state is an instance of animal class
             * and new state is instance of person class.
             * To avoid run over new person class with the old animal
             * class we check if the new state is a class of it's own.
             * If so, use it. Otherwise, use the old state class
             */
            if (isPlainObject(newState)) {
                newEntity = new oldEntity.constructor(merged);
            }
            else {
                newEntity = new newState.constructor(merged);
            }
        }
        updatedEntities[idToUpdate] = preUpdateEntity(oldEntity, newEntity);
    }
    let updatedIds = state.ids;
    let stateEntities = state.entities;
    if (isUpdatingIdKey) {
        const [id] = ids;
        const { [id]: deletedEntity, ...rest } = state.entities;
        stateEntities = rest;
        updatedIds = state.ids.map((current) => (current === id ? idToUpdate : current));
        onEntityIdChanges(id, idToUpdate);
    }
    return {
        ...state,
        entities: {
            ...stateEntities,
            ...updatedEntities,
        },
        ids: updatedIds,
    };
}
//# sourceMappingURL=updateEntities.js.map