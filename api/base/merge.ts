import deepmerge from "deepmerge";

// Deep-merge arrays as an ordered union: keep the target order, then append
// items from the source that aren't already present. Prevents header and
// option arrays from duplicating when a caller's values overlap the defaults.
const mergeOptions: deepmerge.Options = {
    arrayMerge: (target, source) => source.reduce<unknown[]>(
        (acc, item) => (acc.includes(item) ? acc : [...acc, item]),
        [...target]
    )
};

export function merge<T, U>(target: T, source: U): T & U {
    return deepmerge<T, U>(target, source, mergeOptions);
}
