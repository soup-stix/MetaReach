import { filterNilValue } from '../filterNil';
import { toBoolean } from '../toBoolean';
import { getAkitaConfig } from '../config';
import { getValue } from '../getValueByString';
import { setValue } from '../setValueByString';
export class AkitaPlugin {
    constructor(query, config) {
        this.query = query;
        if (config && config.resetFn) {
            if (getAkitaConfig().resettable) {
                this.onReset(config.resetFn);
            }
        }
    }
    /** This method is responsible for getting access to the query. */
    getQuery() {
        return this.query;
    }
    /** This method is responsible for getting access to the store. */
    getStore() {
        return this.getQuery().__store__;
    }
    /** This method is responsible tells whether the plugin is entityBased or not.  */
    isEntityBased(entityId) {
        return toBoolean(entityId);
    }
    /** This method is responsible for selecting the source; it can be the whole store or one entity. */
    selectSource(entityId, property) {
        if (this.isEntityBased(entityId)) {
            return this.getQuery().selectEntity(entityId).pipe(filterNilValue());
        }
        if (property) {
            return this.getQuery().select((state) => getValue(state, this.withStoreName(property)));
        }
        return this.getQuery().select();
    }
    getSource(entityId, property) {
        if (this.isEntityBased(entityId)) {
            return this.getQuery().getEntity(entityId);
        }
        const state = this.getQuery().getValue();
        if (property) {
            return getValue(state, this.withStoreName(property));
        }
        return state;
    }
    withStoreName(prop) {
        return `${this.storeName}.${prop}`;
    }
    get storeName() {
        return this.getStore().storeName;
    }
    /** This method is responsible for updating the store or one entity; it can be the whole store or one entity. */
    updateStore(newState, entityId, property, replace = false) {
        if (this.isEntityBased(entityId)) {
            const store = this.getStore();
            replace ? store.replace(entityId, newState) : store.update(entityId, newState);
        }
        else {
            if (property) {
                this.getStore()._setState((state) => {
                    return setValue(state, this.withStoreName(property), newState, true);
                });
                return;
            }
            const nextState = replace ? newState : (state) => ({ ...state, ...newState });
            this.getStore()._setState(nextState);
        }
    }
    /**
     * Function to invoke upon reset
     */
    onReset(fn) {
        const original = this.getStore().reset;
        this.getStore().reset = (...params) => {
            /** It should run after the plugin destroy method */
            setTimeout(() => {
                original.apply(this.getStore(), params);
                fn();
            });
        };
    }
}
//# sourceMappingURL=plugin.js.map