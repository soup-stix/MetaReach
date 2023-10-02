import { Order } from './sort';
export declare type SortBy<E, S = any> = ((a: E, b: E, state?: S) => number) | keyof E;
export interface SortByOptions<E> {
    sortBy?: SortBy<E>;
    sortByOrder?: Order;
}
export interface QueryConfigOptions<E = any> extends SortByOptions<E> {
}
export declare const queryConfigKey = "akitaQueryConfig";
export declare function QueryConfig<E>(metadata: QueryConfigOptions<E>): (constructor: Function) => void;
