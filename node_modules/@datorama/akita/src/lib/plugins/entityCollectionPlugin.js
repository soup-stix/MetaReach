import { isUndefined } from '../isUndefined';
import { coerceArray } from '../coerceArray';
import { toBoolean } from '../toBoolean';
import { isFunction } from '../isFunction';
/**
 * Each plugin that wants to add support for entities should extend this interface.
 */
export class EntityCollectionPlugin {
    constructor(query, entityIds) {
        this.query = query;
        this.entityIds = entityIds;
        this.entities = new Map();
    }
    /**
     * Get the entity plugin instance.
     */
    getEntity(id) {
        return this.entities.get(id);
    }
    /**
     * Whether the entity plugin exist.
     */
    hasEntity(id) {
        return this.entities.has(id);
    }
    /**
     * Remove the entity plugin instance.
     */
    removeEntity(id) {
        this.destroy(id);
        return this.entities.delete(id);
    }
    /**
     * Set the entity plugin instance.
     */
    createEntity(id, plugin) {
        return this.entities.set(id, plugin);
    }
    /**
     * If the user passes `entityIds` we take them; otherwise, we take all.
     */
    getIds() {
        return isUndefined(this.entityIds) ? this.query.getValue().ids : coerceArray(this.entityIds);
    }
    /**
     * When you call one of the plugin methods, you can pass id/ids or undefined which means all.
     */
    resolvedIds(ids) {
        return isUndefined(ids) ? this.getIds() : coerceArray(ids);
    }
    /**
     * Call this method when you want to activate the plugin on init or when you need to listen to add/remove of entities dynamically.
     *
     * For example in your plugin you may do the following:
     *
     * this.query.select(state => state.ids).pipe(skip(1)).subscribe(ids => this.activate(ids));
     */
    rebase(ids, actions = {}) {
        /**
         *
         * If the user passes `entityIds` & we have new ids check if we need to add/remove instances.
         *
         * This phase will be called only upon update.
         */
        if (toBoolean(ids)) {
            /**
             * Which means all
             */
            if (isUndefined(this.entityIds)) {
                for (let i = 0, len = ids.length; i < len; i++) {
                    const entityId = ids[i];
                    if (this.hasEntity(entityId) === false) {
                        isFunction(actions.beforeAdd) && actions.beforeAdd(entityId);
                        const plugin = this.instantiatePlugin(entityId);
                        this.entities.set(entityId, plugin);
                        isFunction(actions.afterAdd) && actions.afterAdd(plugin);
                    }
                }
                this.entities.forEach((plugin, entityId) => {
                    if (ids.indexOf(entityId) === -1) {
                        isFunction(actions.beforeRemove) && actions.beforeRemove(plugin);
                        this.removeEntity(entityId);
                    }
                });
            }
            else {
                /**
                 * Which means the user passes specific ids
                 */
                const _ids = coerceArray(this.entityIds);
                for (let i = 0, len = _ids.length; i < len; i++) {
                    const entityId = _ids[i];
                    /** The Entity in current ids and doesn't exist, add it. */
                    if (ids.indexOf(entityId) > -1 && this.hasEntity(entityId) === false) {
                        isFunction(actions.beforeAdd) && actions.beforeAdd(entityId);
                        const plugin = this.instantiatePlugin(entityId);
                        this.entities.set(entityId, plugin);
                        isFunction(actions.afterAdd) && actions.afterAdd(plugin);
                    }
                    else {
                        this.entities.forEach((plugin, entityId) => {
                            /** The Entity not in current ids and exists, remove it. */
                            if (ids.indexOf(entityId) === -1 && this.hasEntity(entityId) === true) {
                                isFunction(actions.beforeRemove) && actions.beforeRemove(plugin);
                                this.removeEntity(entityId);
                            }
                        });
                    }
                }
            }
        }
        else {
            /**
             * Otherwise, start with the provided ids or all.
             */
            this.getIds().forEach(id => {
                if (!this.hasEntity(id))
                    this.createEntity(id, this.instantiatePlugin(id));
            });
        }
    }
    /**
     * Listen for add/remove entities.
     */
    selectIds() {
        return this.query.select(state => state.ids);
    }
    /**
     * Base method for activation, you can override it if you need to.
     */
    activate(ids) {
        this.rebase(ids);
    }
    /**
     * Loop over each id and invoke the plugin method.
     */
    forEachId(ids, cb) {
        const _ids = this.resolvedIds(ids);
        for (let i = 0, len = _ids.length; i < len; i++) {
            const id = _ids[i];
            if (this.hasEntity(id)) {
                cb(this.getEntity(id));
            }
        }
    }
}
//# sourceMappingURL=entityCollectionPlugin.js.map