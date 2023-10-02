/**
 * Create an array value comparator for a specific key of the value.
 * @param prop The property of the value to be compared.
 */
export declare function byKey<T>(prop: keyof T): (a: T, b: T) => boolean;
/**
 * Create an array value comparator for the id field of an array value.
 */
export declare function byId<T extends Record<'id', any>>(): (a: T, b: T) => boolean;
/**
 * Adds or removes a value from an array by comparing its values. If a matching value exists it is removed, otherwise
 * it is added to the array.
 *
 * @param array The array to modify.
 * @param newValue The new value to toggle.
 * @param compare A compare function to determine equality of array values. Default is an equality test by object identity.
 */
export declare function arrayToggle<T>(array: T[], newValue: T, compare?: (a: T, b: T) => boolean): T[];
