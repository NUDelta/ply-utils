import { fromJS, OrderedMap, Map } from 'immutable';

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
 * urlKeywords: List< OrderedMap<[prop: string]: count: number> >,
 * fn: (OrderedMap<[prop: string]: count: number> -> OrderedMap<[prop: string]: count: number>)
 * -> OrderedMap<[prop: string]: count: number>
 *
 * Reduces a List of OrderedMaps detailing props and their frequencies to
 * one OrderedMap, according to a supplied weighting function.
 * Used to predict relevance for a given technique, across all input URLs.
 */
export function reduceData (urlKeywords, init = Map(), fn = binary) {
  // Apply `fn` to each URL's distribution
  const normalized = urlKeywords.map(fn);
  const reduced = normalized.reduce(
    (acc, instance) => acc.mergeWith((prev, next) => prev + next, instance),
    init
  );
  return reduced.sort().reverse();
}
