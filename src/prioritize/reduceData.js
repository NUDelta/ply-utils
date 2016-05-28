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
 * init?: [Map<[prop: string]: count: number>, n: number]
 * -> [OrderedMap<[prop: string]: count: number>, number]
 *
 * Helper function for reduceData and reduceDataBulk.
 * Reduces a List of OrderedMaps into one OrderedMap, adding everything together.
 * Returns a pair consisting of the reduced OrderedMap,
 * along with the number of sites the reduction is based on.
 */
function reducer (normalized, old = Map(), n = 0) {
  const reduced = normalized.reduce(
    (acc, instance) => acc.mergeWith((prev, next) => prev + next, instance),
    old
  );
  const newCount = n + normalized.size;

  // Filter out zero-valued props and sort
  const sorted = reduced.filter(val => val > 0)
    .sort()
    .reverse();  // Want highest vals first

  return [sorted, newCount];
}

/**
 * instance: OrderedMap<[prop: string]: count: number>,
 * init?: [Map<[prop: string]: count: number>, n: number],
 * fn?: (OrderedMap<[prop: string]: count: number> -> OrderedMap<[prop: string]: count: number>)
 * -> [OrderedMap<[prop: string]: count: number>, number]
 *
 * Adds a single new instance to a reduction.
 */
export function reduceDataSingle (instance, init = [Map(), 0], fn = binary) {
  // Apply `fn` to the instance
  const normalized = List([fn(instance)]);
  const [reduced, n] = reducer(normalized, ...init);
  return [reduced, n];
}

/**
 * urlKeywords: List< OrderedMap<[prop: string]: count: number> >,
 * init?: [Map<[prop: string]: count: number>, n: number],
 * fn?: (OrderedMap<[prop: string]: count: number> -> OrderedMap<[prop: string]: count: number>)
 * -> [OrderedMap<[prop: string]: count: number>, number]
 *
 * Adds a List of new URL instances to a reduction.
 */
export function reduceDataBulk (urlKeywords, init = [Map(), 0], fn = binary) {
  // Apply `fn` to each URL's distribution
  const normalized = urlKeywords.map(fn);
  const [reduced, n] = reducer(normalized, ...init);
  return [reduced, n];
}
