import { BehaviorSubject, combineLatest, distinctUntilChanged, map, skip, Subject } from 'rxjs';
import { logAction } from '../../actions';
import { coerceArray } from '../../coerceArray';
import { isFunction } from '../../isFunction';
import { isUndefined } from '../../isUndefined';
import { QueryEntity } from '../../queryEntity';
import { AkitaPlugin } from '../plugin';
export const dirtyCheckDefaultParams = {
    comparator: (head, current) => JSON.stringify(head) !== JSON.stringify(current),
};
export function getNestedPath(nestedObj, path) {
    const pathAsArray = path.split('.');
    return pathAsArray.reduce((obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined), nestedObj);
}
export class DirtyCheckPlugin extends AkitaPlugin {
    constructor(query, params, _entityId) {
        super(query);
        this.query = query;
        this.params = params;
        this._entityId = _entityId;
        this.dirty = new BehaviorSubject(false);
        this.active = false;
        this._reset = new Subject();
        this.isDirty$ = this.dirty.asObservable().pipe(distinctUntilChanged());
        this.reset$ = this._reset.asObservable();
        this.params = { ...dirtyCheckDefaultParams, ...params };
        if (this.params.watchProperty) {
            const watchProp = coerceArray(this.params.watchProperty);
            if (query instanceof QueryEntity && watchProp.includes('entities') && !watchProp.includes('ids')) {
                watchProp.push('ids');
            }
            this.params.watchProperty = watchProp;
        }
    }
    reset(params = {}) {
        let currentValue = this.head;
        if (isFunction(params.updateFn)) {
            if (this.isEntityBased(this._entityId)) {
                currentValue = params.updateFn(this.head, this.getQuery().getEntity(this._entityId));
            }
            else {
                currentValue = params.updateFn(this.head, this.getQuery().getValue());
            }
        }
        logAction(`@DirtyCheck - Revert`);
        this.updateStore(currentValue, this._entityId);
        this._reset.next(true);
    }
    setHead() {
        if (!this.active) {
            this.activate();
            this.active = true;
        }
        else {
            this.head = this._getHead();
        }
        this.updateDirtiness(false);
        return this;
    }
    isDirty() {
        return !!this.dirty.value;
    }
    hasHead() {
        return !!this.getHead();
    }
    destroy() {
        this.head = null;
        this.subscription && this.subscription.unsubscribe();
        this._reset && this._reset.complete();
    }
    isPathDirty(path) {
        const head = this.getHead();
        const current = this.getQuery().getValue();
        const currentPathValue = getNestedPath(current, path);
        const headPathValue = getNestedPath(head, path);
        return this.params.comparator(currentPathValue, headPathValue);
    }
    getHead() {
        return this.head;
    }
    activate() {
        this.head = this._getHead();
        /** if we are tracking specific properties select only the relevant ones */
        const sources = this.params.watchProperty
            ? this.params.watchProperty.map((prop) => this.query
                .select((state) => state[prop])
                .pipe(map((val) => ({
                val,
                __akitaKey: prop,
            }))))
            : [this.selectSource(this._entityId)];
        this.subscription = combineLatest(sources)
            .pipe(skip(1))
            .subscribe((currentState) => {
            if (isUndefined(this.head))
                return;
            /** __akitaKey is used to determine if we are tracking a specific property or a store change */
            const isChange = currentState.some((state) => {
                const head = state.__akitaKey ? this.head[state.__akitaKey] : this.head;
                const compareTo = state.__akitaKey ? state.val : state;
                return this.params.comparator(head, compareTo);
            });
            this.updateDirtiness(isChange);
        });
    }
    updateDirtiness(isDirty) {
        this.dirty.next(isDirty);
    }
    _getHead() {
        let head = this.getSource(this._entityId);
        if (this.params.watchProperty) {
            head = this.getWatchedValues(head);
        }
        return head;
    }
    getWatchedValues(source) {
        return this.params.watchProperty.reduce((watched, prop) => {
            watched[prop] = source[prop];
            return watched;
        }, {});
    }
}
//# sourceMappingURL=dirtyCheckPlugin.js.map