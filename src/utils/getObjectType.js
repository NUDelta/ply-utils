import { fromJS, Map, OrderedMap, List } from 'immutable';

/**
 * input: OrderedMap -> 'ImmutableOrderedMap'
 * input: List -> 'ImmutableList'
 * input: Map -> 'ImmutableMap'
 * input: Array -> 'JSArray'
 * input: Object -> 'JSObject'
 *
 * Returns a string indicating the type of the input,
 * else throws an error.
 */
export function getObjectType (input) {
  if (Array.isArray(input)) return 'JSArray';

  if (typeof input === 'object') {
    // Now we check whether it's a JS object
    if (List.isList(input)) return 'ImmutableList';

    if (Map.isMap(input)) {
      // Check whether it's Ordered
      if (OrderedMap.isOrderedMap(input)) return 'ImmutableOrderedMap';
      return 'ImmutableMap';
    }

    // If it's not a List or Map/OrderedMap, it's a JS Object
    return 'JSObject';
  }

  // If we have no idea, throw an error
  throw new Error('Unrecognized type');
}
