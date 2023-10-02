import { skip } from 'rxjs';
import { toBoolean } from '../../toBoolean';
import { EntityCollectionPlugin } from '../entityCollectionPlugin';
import { StateHistoryPlugin } from './stateHistoryPlugin';
export class EntityStateHistoryPlugin extends EntityCollectionPlugin {
    constructor(query, params = {}) {
        super(query, params.entityIds);
        this.query = query;
        this.params = params;
        params.maxAge = toBoolean(params.maxAge) ? params.maxAge : 10;
        this.activate();
        this.selectIds()
            .pipe(skip(1))
            .subscribe((ids) => this.activate(ids));
    }
    redo(ids) {
        this.forEachId(ids, (e) => e.redo());
    }
    undo(ids) {
        this.forEachId(ids, (e) => e.undo());
    }
    hasPast(id) {
        if (this.hasEntity(id)) {
            return this.getEntity(id).hasPast;
        }
    }
    hasFuture(id) {
        if (this.hasEntity(id)) {
            return this.getEntity(id).hasFuture;
        }
    }
    jumpToFuture(ids, index) {
        this.forEachId(ids, (e) => e.jumpToFuture(index));
    }
    jumpToPast(ids, index) {
        this.forEachId(ids, (e) => e.jumpToPast(index));
    }
    clear(ids, customUpdateFn) {
        this.forEachId(ids, (e) => e.clear(customUpdateFn));
    }
    destroy(ids, clearHistory = false) {
        this.forEachId(ids, (e) => e.destroy(clearHistory));
    }
    ignoreNext(ids) {
        this.forEachId(ids, (e) => e.ignoreNext());
    }
    instantiatePlugin(id) {
        return new StateHistoryPlugin(this.query, this.params, id);
    }
}
//# sourceMappingURL=entityStateHistoryPlugin.js.map