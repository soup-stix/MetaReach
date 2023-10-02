import { auditTime, combineLatest } from 'rxjs';
export function combineQueries(observables) {
    return combineLatest(observables).pipe(auditTime(0));
}
//# sourceMappingURL=combineQueries.js.map