import { ItemPredicate } from './types';
export declare function findEntityByPredicate<E>(predicate: ItemPredicate<E>, entities: any): string;
export declare function getEntity(id: any, project: any): (entities: any) => any;
