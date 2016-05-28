import { fromJS, Map, OrderedMap, List } from 'immutable';
import { getObjectType, isJS, isImmutable } from './getObjectType';

/**
 * A collection of utility functions for converting to and
 * from Immutable.js data types and regular JSON.
 *
 * Mainly used for interfacing with Firebase.
 */

/**
 * input: OrderedMap | Map -> Object
 * input: List -> Array
 * input: Object -> Object
 * input: Array -> Array
 *
 * If input is an Immutable List, OrderedMap, or Map,
 * convert deeply to JS and returns the result.
 *
 * If input at the highest level is a regular JS array or object, act as the identity function.
 */
export function immutableToJS (input) {
  if (isJS(input)) return input;
  return input.toJS();
}

/**
 * input: Object -> Map
 * input: Array -> List
 * input: List -> List
 * input: Map -> Map
 * input: OrderedMap -> OrderedMap
 *
 * If input is a JS array or object,
 * convert deeply to Immutable and return.
 *
 * If input is already Immutable, act as the identity function.
 *
 * DOES NOT convert to OrderedMap.
 */
export function jsToImmutable (input) {
  if (isImmutable(input)) return input;
  return fromJS(input);
}
