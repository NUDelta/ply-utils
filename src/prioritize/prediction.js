import { OrderedMap } from 'immutable';
import DEFAULT_RULES from '../../constants/predictionRules';

/**
 * dist: OrderedMap<[prop: string]: count: number>,
 * n: number,
 * rules?: (n: number) => (x: number => 0 | 1 | 2 | 3)
 * -> [OrderedMap({ 3: List<prop: string>,
 *                  2: List<prop: string>,
 *                  1: List<prop: string>,
 *                  0: List<prop: string> }),
 *     number]
 *
 * Assigns each `prop` in a distribution a priority:
 *  - 3: almost certainly relevant
 *  - 2: likely relevant
 *  - 1: no information
 *  - 0: almost certainly irrelevant
 *
 * Returns the partition along with the original count n.
 */
export function prediction (dist, n, rules) {
  const grouper = rules ? rules(n) : DEFAULT_RULES(n);
  const groups = dist.groupBy(grouper);
  const prediction = groups.map(members => members.keySeq().toList());
  return prediction;
}
