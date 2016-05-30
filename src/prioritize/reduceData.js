import { fromJS, Map, List } from 'immutable';

const DEFAULT = List.of(Map(), 0);

/**
 * tallies: Map<[prop: string]: count: number> -> Map<[prop: string]: count: number>
 *
 * Default function applied to each Map of `props` and
 * frequencies, for a given URL.
 * Simply returns 1 if the `prop` occurred anywhere in the page.
 */
export function binary (tallies) {
  /* eslint no-unused-vars: "off" */
  return tallies.map(count => 1);
}

/**
 * normalized: List< Map<[prop: string]: count: number> >,
 * init?: List[ Map<[prop: string]: count: number>, n: number ]
 * -> List[ Map<[prop: string]: count: number>, number ]
 *
 * Helper function for reduceData and reduceDataBulk.
 * Reduces a List of Maps into one Map, adding everything together.
 * Returns a pair consisting of the reduced Map,
 * along with the number of sites the reduction is based on.
 */
function reducer (normalized, old = Map(), n = 0) {
  const reduced = normalized.reduce(
    (acc, instance) => acc.mergeWith((prev, next) => prev + next, instance),
    old
  );
  const newCount = n + normalized.size;

  // Filter out zero-valued props
  const filtered = reduced.filter(val => val > 0);

  return List.of(filtered, newCount);
}

/**
 * instance: Map<[prop: string]: count: number>,
 * init?: List[ Map<[prop: string]: count: number>, n: number ],
 * fn?: (Map<[prop: string]: count: number> -> Map<[prop: string]: count: number>)
 * -> List[ Map<[prop: string]: count: number>, number ]
 *
 * Adds a single new instance to a reduction.
 */
export function reduceDataSingle (instance, init = DEFAULT, fn = binary) {
  // Apply `fn` to the instance
  const normalized = List([fn(instance)]);
  const [reduced, n] = reducer(normalized, ...init);
  return List.of(reduced, n);
}

/**
 * urlKeywords: List< Map<[prop: string]: count: number> >,
 * init?: List[ Map<[prop: string]: count: number>, n: number ],
 * fn?: (Map<[prop: string]: count: number> -> Map<[prop: string]: count: number>)
 * -> List[ Map<[prop: string]: count: number>, number ]
 *
 * Adds a List of new URL instances to a reduction.
 */
export function reduceDataBulk (urlKeywords, init = DEFAULT, fn = binary) {
  // Apply `fn` to each URL's distribution
  const normalized = urlKeywords.map(fn);
  const [reduced, n] = reducer(normalized, ...init);
  return List.of(reduced, n);
}
