import { Observable } from 'rxjs';
declare type ReturnTypes<T extends Observable<any>[]> = {
    [P in keyof T]: T[P] extends Observable<infer R> ? R : never;
};
declare type Observables = [Observable<any>] | Observable<any>[];
export declare function combineQueries<R extends Observables>(observables: R): Observable<ReturnTypes<R>>;
export {};
