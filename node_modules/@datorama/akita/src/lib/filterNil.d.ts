import { Observable, OperatorFunction } from 'rxjs';
/**
 * @example
 *
 * query.selectEntity(2).pipe(filterNil)
 * @deprecated Use the operator function filterNilValue()
 */
export declare const filterNil: <T>(source: Observable<T>) => Observable<NonNullable<T>>;
/**
 * @example
 *
 * query.selectEntity(2).pipe(filterNilValue())
 */
export declare function filterNilValue<T>(): OperatorFunction<T, NonNullable<T>>;
