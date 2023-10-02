import { defer, finalize } from 'rxjs';
export function setLoading(store) {
    return function (source) {
        return defer(() => {
            store.setLoading(true);
            return source.pipe(finalize(() => store.setLoading(false)));
        });
    };
}
//# sourceMappingURL=setLoading.js.map