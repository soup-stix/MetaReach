import { debounceTime } from 'rxjs';
import { logAction } from '../../actions';
import { getValue } from '../../getValueByString';
import { isString } from '../../isString';
import { setValue } from '../../setValueByString';
import { toBoolean } from '../../toBoolean';
import { AkitaPlugin } from '../plugin';
export class PersistNgFormPlugin extends AkitaPlugin {
    constructor(query, factoryFnOrPath, params = {}) {
        super(query);
        this.query = query;
        this.factoryFnOrPath = factoryFnOrPath;
        this.params = params;
        this.params = { ...{ debounceTime: 300, formKey: 'akitaForm', emitEvent: false, arrControlFactory: (v) => this.builder.control(v) }, ...params };
        this.isRootKeys = toBoolean(factoryFnOrPath) === false;
        this.isKeyBased = isString(factoryFnOrPath) || this.isRootKeys;
    }
    setForm(form, builder) {
        this.form = form;
        this.builder = builder;
        this.activate();
        return this;
    }
    reset(initialState) {
        let value;
        if (initialState) {
            value = initialState;
        }
        else {
            value = this.isKeyBased ? this.initialValue : this.factoryFnOrPath();
        }
        if (this.isKeyBased) {
            Object.keys(this.initialValue).forEach((stateKey) => {
                const value = this.initialValue[stateKey];
                if (Array.isArray(value) && this.builder) {
                    const formArray = this.form.controls[stateKey];
                    this.cleanArray(formArray);
                    value.forEach((v, i) => {
                        this.form.get(stateKey).insert(i, this.params.arrControlFactory(v));
                    });
                }
            });
        }
        this.form.patchValue(value, { emitEvent: this.params.emitEvent });
        const storeValue = this.isKeyBased ? setValue(this.getQuery().getValue(), `${this.getStore().storeName}.${this.factoryFnOrPath}`, value) : { [this.params.formKey]: value };
        this.updateStore(storeValue);
    }
    cleanArray(control) {
        while (control.length !== 0) {
            control.removeAt(0);
        }
    }
    resolveInitialValue(formValue, root) {
        if (!formValue)
            return;
        return Object.keys(formValue).reduce((acc, stateKey) => {
            const value = root[stateKey];
            if (Array.isArray(value) && this.builder) {
                const factory = this.params.arrControlFactory;
                this.cleanArray(this.form.get(stateKey));
                value.forEach((v, i) => {
                    this.form.get(stateKey).insert(i, factory(v));
                });
            }
            acc[stateKey] = root[stateKey];
            return acc;
        }, {});
    }
    activate() {
        let path;
        if (this.isKeyBased) {
            if (this.isRootKeys) {
                this.initialValue = this.resolveInitialValue(this.form.value, this.getQuery().getValue());
                this.form.patchValue(this.initialValue, { emitEvent: this.params.emitEvent });
            }
            else {
                path = `${this.getStore().storeName}.${this.factoryFnOrPath}`;
                const root = getValue(this.getQuery().getValue(), path);
                this.initialValue = this.resolveInitialValue(root, root);
                this.form.patchValue(this.initialValue, { emitEvent: this.params.emitEvent });
            }
        }
        else {
            if (!this.getQuery().getValue()[this.params.formKey]) {
                logAction('@PersistNgFormPlugin activate');
                this.updateStore({ [this.params.formKey]: this.factoryFnOrPath() });
            }
            const value = this.getQuery().getValue()[this.params.formKey];
            this.form.patchValue(value);
        }
        this.formChanges = this.form.valueChanges.pipe(debounceTime(this.params.debounceTime)).subscribe((value) => {
            logAction('@PersistForm - Update');
            let newState;
            if (this.isKeyBased) {
                if (this.isRootKeys) {
                    newState = (state) => ({ ...state, ...value });
                }
                else {
                    newState = (state) => setValue(state, path, value);
                }
            }
            else {
                newState = () => ({ [this.params.formKey]: value });
            }
            this.updateStore(newState(this.getQuery().getValue()));
        });
    }
    destroy() {
        this.formChanges && this.formChanges.unsubscribe();
        this.form = null;
        this.builder = null;
    }
}
//# sourceMappingURL=persistNgFormPlugin.js.map