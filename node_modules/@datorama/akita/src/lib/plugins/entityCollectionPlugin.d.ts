import { Observable } from 'rxjs';
import { EntityState, OrArray, getIDType } from '../types';
import { QueryEntity } from '../queryEntity';
export declare type RebaseAction<P = any> = (plugin: P) => any;
export declare type RebaseActions<P = any> = {
    beforeRemove?: RebaseAction;
    beforeAdd?: RebaseAction;
    afterAdd?: RebaseAction;
};
/**
 * Each plugin that wants to add support for entities should extend this interface.
 */
export declare abstract class EntityCollectionPlugin<State extends EntityState, P> {
    protected query: QueryEntity<State>;
    private entityIds;
    protected entities: Map<getIDType<State>, P>;
    protected constructor(query: QueryEntity<State>, entityIds: OrArray<getIDType<State>>);
    /**
     * Get the entity plugin instance.
     */
    protected getEntity(id: getIDType<State>): P;
    /**
     * Whether the entity plugin exist.
     */
    protected hasEntity(id: getIDType<State>): boolean;
    /**
     * Remove the entity plugin instance.
     */
    protected removeEntity(id: getIDType<State>): boolean;
    /**
     * Set the entity plugin instance.
     */
    protected createEntity(id: getIDType<State>, plugin: P): Map<getIDType<State>, P>;
    /**
     * If the user passes `entityIds` we take them; otherwise, we take all.
     */
    protected getIds(): any;
    /**
     * When you call one of the plugin methods, you can pass id/ids or undefined which means all.
     */
    protected resolvedIds(ids?: any): getIDType<State>[];
    /**
     * Call this method when you want to activate the plugin on init or when you need to listen to add/remove of entities dynamically.
     *
     * For example in your plugin you may do the following:
     *
     * this.query.select(state => state.ids).pipe(skip(1)).subscribe(ids => this.activate(ids));
     */
    protected rebase(ids: getIDType<State>[], actions?: RebaseActions<P>): void;
    /**
     * Listen for add/remove entities.
     */
    protected selectIds(): Observable<any>;
    /**
     * Base method for activation, you can override it if you need to.
     */
    protected activate(ids?: any[]): void;
    /**
     * This method is responsible for plugin instantiation.
     *
     * For example:
     * return new StateHistory(this.query, this.params, id) as P;
     */
    protected abstract instantiatePlugin(id: getIDType<State>): P;
    /**
     * This method is responsible for cleaning.
     */
    abstract destroy(id?: getIDType<State>): any;
    /**
     * Loop over each id and invoke the plugin method.
     */
    protected forEachId(ids: OrArray<getIDType<State>>, cb: (entity: P) => any): void;
}
