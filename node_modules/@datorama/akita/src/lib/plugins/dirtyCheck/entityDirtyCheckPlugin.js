import { auditTime, map, merge, skip, Subject } from 'rxjs';
import { coerceArray } from '../../coerceArray';
import { EntityCollectionPlugin } from '../entityCollectionPlugin';
import { dirtyCheckDefaultParams, DirtyCheckPlugin, getNestedPath } from './dirtyCheckPlugin';
export class EntityDirtyCheckPlugin extends EntityCollectionPlugin {
    constructor(query, params = {}) {
        super(query, params.entityIds);
        this.query = query;
        this.params = params;
        this._someDirty = new Subject();
        this.someDirty$ = merge(this.query.select((state) => state.entities), this._someDirty.asObservable()).pipe(auditTime(0), map(() => this.checkSomeDirty()));
        this.params = { ...dirtyCheckDefaultParams, ...params };
        // TODO lazy activate?
        this.activate();
        this.selectIds()
            .pipe(skip(1))
            .subscribe((ids) => {
            super.rebase(ids, { afterAdd: (plugin) => plugin.setHead() });
        });
    }
    setHead(ids) {
        if (this.params.entityIds && ids) {
            const toArray = coerceArray(ids);
            const someAreWatched = coerceArray(this.params.entityIds).some((id) => toArray.indexOf(id) > -1);
            if (someAreWatched === false) {
                return this;
            }
        }
        this.forEachId(ids, (e) => e.setHead());
        this._someDirty.next(true);
        return this;
    }
    hasHead(id) {
        if (this.entities.has(id)) {
            const entity = this.getEntity(id);
            return entity.hasHead();
        }
        return false;
    }
    reset(ids, params = {}) {
        this.forEachId(ids, (e) => e.reset(params));
    }
    isDirty(id, asObservable = true) {
        if (this.entities.has(id)) {
            const entity = this.getEntity(id);
            return asObservable ? entity.isDirty$ : entity.isDirty();
        }
        return false;
    }
    someDirty() {
        return this.checkSomeDirty();
    }
    isPathDirty(id, path) {
        if (this.entities.has(id)) {
            const head = this.getEntity(id).getHead();
            const current = this.query.getEntity(id);
            const currentPathValue = getNestedPath(current, path);
            const headPathValue = getNestedPath(head, path);
            return this.params.comparator(currentPathValue, headPathValue);
        }
        return null;
    }
    destroy(ids) {
        this.forEachId(ids, (e) => e.destroy());
        /** complete only when the plugin destroys */
        if (!ids) {
            this._someDirty.complete();
        }
    }
    instantiatePlugin(id) {
        return new DirtyCheckPlugin(this.query, this.params, id);
    }
    checkSomeDirty() {
        const entitiesIds = this.resolvedIds();
        for (const id of entitiesIds) {
            if (this.getEntity(id).isDirty()) {
                return true;
            }
        }
        return false;
    }
}
//# sourceMappingURL=entityDirtyCheckPlugin.js.map