import { isNil } from './isNil';
import { isObject } from './isObject';
import { isArray } from './isArray';
// @internal
export function getActiveEntities(idOrOptions, ids, currentActive) {
    let result;
    if (isArray(idOrOptions)) {
        result = idOrOptions;
    }
    else {
        if (isObject(idOrOptions)) {
            if (isNil(currentActive))
                return;
            idOrOptions = Object.assign({ wrap: true }, idOrOptions);
            const currentIdIndex = ids.indexOf(currentActive);
            if (idOrOptions.prev) {
                const isFirst = currentIdIndex === 0;
                if (isFirst && !idOrOptions.wrap)
                    return;
                result = isFirst ? ids[ids.length - 1] : ids[currentIdIndex - 1];
            }
            else if (idOrOptions.next) {
                const isLast = ids.length === currentIdIndex + 1;
                if (isLast && !idOrOptions.wrap)
                    return;
                result = isLast ? ids[0] : ids[currentIdIndex + 1];
            }
        }
        else {
            if (idOrOptions === currentActive)
                return;
            result = idOrOptions;
        }
    }
    return result;
}
//# sourceMappingURL=getActiveEntities.js.map