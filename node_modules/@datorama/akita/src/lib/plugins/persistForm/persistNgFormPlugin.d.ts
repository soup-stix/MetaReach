import { Observable, Subscription } from 'rxjs';
import { Query } from '../../query';
import { AkitaPlugin } from '../plugin';
export declare type FormGroupLike = {
    patchValue: Function;
    setValue: Function;
    value: any;
    get: Function;
    valueChanges: Observable<any>;
    controls: any;
};
export declare type AkitaFormProp<T> = {
    [key: string]: T;
};
export declare type PersistFormParams = {
    debounceTime?: number;
    formKey?: string;
    emitEvent?: boolean;
    arrControlFactory?: ArrayControlFactory;
};
export declare type ArrayControlFactory = (value: any) => any;
export declare class PersistNgFormPlugin<T = any> extends AkitaPlugin {
    protected query: Query<any>;
    private factoryFnOrPath?;
    private params;
    formChanges: Subscription;
    private isRootKeys;
    private form;
    private isKeyBased;
    private initialValue;
    private builder;
    constructor(query: Query<any>, factoryFnOrPath?: Function | string, params?: PersistFormParams);
    setForm(form: FormGroupLike, builder?: any): this;
    reset(initialState?: T): void;
    private cleanArray;
    private resolveInitialValue;
    private activate;
    destroy(): void;
}
