import { filter } from 'rxjs';
/**
 * @example
 *
 * query.selectEntity(2).pipe(filterNil)
 * @deprecated Use the operator function filterNilValue()
 */
export const filterNil = (source) => source.pipe(filter((value) => value !== null && typeof value !== 'undefined'));
/**
 * @example
 *
 * query.selectEntity(2).pipe(filterNilValue())
 */
export function filterNilValue() {
    return filter((value) => value !== null && value !== undefined);
}
//# sourceMappingURL=filterNil.js.map