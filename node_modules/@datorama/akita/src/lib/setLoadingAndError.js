import { defer, tap } from 'rxjs';
export function setLoadingAndError(store) {
    return function (source) {
        return defer(() => {
            store.setLoading(true);
            store.setError(null);
            return source.pipe(tap({
                error(err) {
                    store.setLoading(false);
                    store.setError(err);
                },
                complete() {
                    store.setLoading(false);
                },
            }));
        });
    };
}
//# sourceMappingURL=setLoadingAndError.js.map