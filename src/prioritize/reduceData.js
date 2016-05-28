import { fromJS, OrderedMap, Map, List } from 'immutable';

/**
 * tallies: OrderedMap<[prop: string]: count: number> -> OrderedMap<[prop: string]: count: number>
 *
 * Default function applied to each OrderedMap of `props` and
 * frequencies, for a given URL.
 * Simply returns 1 if the `prop` occurred anywhere in the page.
 */
export function binary (tallies) {
  /* eslint no-unused-vars: "off" */
  return tallies.map(count => 1);
}

/**
 * normalized: List< OrderedMap<[prop: string]: count: number> >,
 * -> OrderedMap<[prop: string]: count: number>
 *
 * Reduces a List of OrderedMaps into one OrderedMap, adding everything
 * together. Helper function for reduceData and reduceDataBulk.
 */
function reducer (normalized, init = Map()) {
  const reduced = normalized.reduce(
    (acc, instance) => acc.mergeWith((prev, next) => prev + next, instance),
    init
  );
  return reduced.sort().reverse();
}

/**
 * instance: OrderedMap<[prop: string]: count: number>,
 * fn: (OrderedMap<[prop: string]: count: number> -> OrderedMap<[prop: string]: count: number>)
 * -> OrderedMap<[prop: string]: count: number>
 *
 * Reduces a single OrderedMap detailing props and their frequencies into a supplied
 * initial OrderedMap, according to a supplied weighting function.
 * Used to add a single new instance
 */
export function reduceDataSingle (instance, init = Map(), fn = binary) {
  // Apply `fn` to the instance
  const normalized = List([fn(instance)]);
  return reducer(normalized, init);
}

/**
 * urlKeywords: List< OrderedMap<[prop: string]: count: number> >,
 * fn: (OrderedMap<[prop: string]: count: number> -> OrderedMap<[prop: string]: count: number>)
 * -> OrderedMap<[prop: string]: count: number>
 *
 * Reduces a List of OrderedMaps detailing props and their frequencies to
 * one OrderedMap, according to a supplied weighting function.
 * Used to predict relevance for a given technique, across all input URLs.
 */
export function reduceDataBulk (urlKeywords, init = Map(), fn = binary) {
  // Apply `fn` to each URL's distribution
  const normalized = urlKeywords.map(fn);
  return reducer(normalized, init);
}
