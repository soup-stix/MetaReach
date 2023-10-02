import { QueryEntity } from '../queryEntity';
import { Query } from '../query';
import { EntityState } from '../types';
export declare type Queries<State extends EntityState> = Query<State> | QueryEntity<State>;
export declare abstract class AkitaPlugin<State extends EntityState = any> {
    protected query: Queries<State>;
    protected constructor(query: Queries<State>, config?: {
        resetFn?: Function;
    });
    /** This method is responsible for getting access to the query. */
    protected getQuery(): Queries<State>;
    /** This method is responsible for getting access to the store. */
    protected getStore(): any;
    /** This method is responsible for cleaning. */
    abstract destroy(): any;
    /** This method is responsible tells whether the plugin is entityBased or not.  */
    protected isEntityBased(entityId: any): boolean;
    /** This method is responsible for selecting the source; it can be the whole store or one entity. */
    protected selectSource(entityId: any, property?: string): import("rxjs").Observable<any>;
    protected getSource(entityId: any, property?: string): any;
    protected withStoreName(prop: string): string;
    protected get storeName(): any;
    /** This method is responsible for updating the store or one entity; it can be the whole store or one entity. */
    protected updateStore(newState: any, entityId?: any, property?: string, replace?: boolean): void;
    /**
     * Function to invoke upon reset
     */
    private onReset;
}
