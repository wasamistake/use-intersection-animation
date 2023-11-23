import type { SyntheticEffect } from '.'

/**
 * Asserts that `arg` is an object, i.e., something with key-value pairs.
 */
function isObject(arg: unknown): arg is object {
  return typeof arg === 'object' && arg !== null && !Array.isArray(arg)
}

/**
 * Asserts that `arg` has the shape of `SyntheticEffect`.
 */
export function isSyntheticEffect(arg: unknown): arg is SyntheticEffect {
  return isObject(arg) && 'keyframes' in arg && 'options' in arg
}
