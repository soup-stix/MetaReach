import { SelectOptions } from './types';
import { SortBy } from './queryConfig';
import { Order } from './sort';
export declare type SelectAllOptionsA<E> = {
    asObject: true;
    filterBy?: SelectOptions<E>['filterBy'];
    limitTo?: number;
    sortBy?: undefined;
    sortByOrder?: undefined;
};
export declare type SelectAllOptionsB<E> = {
    filterBy: SelectOptions<E>['filterBy'];
    limitTo?: number;
    sortBy?: SortBy<E>;
    sortByOrder?: Order;
};
export declare type SelectAllOptionsC<E> = {
    asObject: true;
    limitTo?: number;
    sortBy?: undefined;
    sortByOrder?: undefined;
};
export declare type SelectAllOptionsD<E> = {
    limitTo?: number;
    sortBy?: SortBy<E>;
    sortByOrder?: Order;
};
export declare type SelectAllOptionsE<E> = {
    asObject: false;
    filterBy?: SelectOptions<E>['filterBy'];
    limitTo?: number;
    sortBy?: SortBy<E>;
    sortByOrder?: Order;
};
