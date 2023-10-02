import { EntityState, SelectOptions } from './types';
export declare function entitiesToArray<E, S extends EntityState>(state: S, options: SelectOptions<E>): E[];
