import { isFunction } from './isFunction';
export function compareKeys(keysOrFuncs) {
    return function (prevState, currState) {
        const isFns = isFunction(keysOrFuncs[0]);
        // Return when they are NOT changed
        return keysOrFuncs.some(keyOrFunc => {
            if (isFns) {
                return keyOrFunc(prevState) !== keyOrFunc(currState);
            }
            return prevState[keyOrFunc] !== currState[keyOrFunc];
        }) === false;
    };
}
//# sourceMappingURL=compareKeys.js.map