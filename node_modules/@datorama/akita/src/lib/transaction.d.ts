import { Observable, Subject } from 'rxjs';
export declare type TransactionManager = {
    activeTransactions: number;
    batchTransaction: Subject<boolean> | null;
};
export declare const transactionManager: TransactionManager;
export declare function startBatch(): void;
export declare function endBatch(): void;
export declare function isTransactionInProcess(): boolean;
export declare function commit(): Observable<boolean>;
/**
 *  A logical transaction.
 *  Use this transaction to optimize the dispatch of all the stores.
 *  The following code will update the store, BUT  emits only once
 *
 *  @example
 *  applyTransaction(() => {
 *    this.todosStore.add(new Todo(1, title));
 *    this.todosStore.add(new Todo(2, title));
 *  });
 *
 */
export declare function applyTransaction<T>(action: () => T, thisArg?: any): T;
/**
 *  A logical transaction.
 *  Use this transaction to optimize the dispatch of all the stores.
 *
 *  The following code will update the store, BUT  emits only once.
 *
 *  @example
 *  @transaction
 *  addTodos() {
 *    this.todosStore.add(new Todo(1, title));
 *    this.todosStore.add(new Todo(2, title));
 *  }
 *
 *
 */
export declare function transaction(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
/**
 *
 * RxJS custom operator that wraps the callback inside transaction
 *
 * @example
 *
 * return http.get().pipe(
 *    withTransaction(response > {
 *      store.setActive(1);
 *      store.update();
 *      store.updateEntity(1, {});
 *    })
 * )
 *
 */
export declare function withTransaction<T>(next: (value: T) => void): (source: Observable<T>) => Observable<T>;
