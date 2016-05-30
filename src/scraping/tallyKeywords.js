import { fromJS, List, Map } from 'immutable';
import { warning, logExceptOnTest } from '../utils/msg';
import expand from 'css-shorthand-expand';
import keywords from '../../constants/keywords';
import shorthand from '../../constants/shorthand';

const KEYWORDS = fromJS(keywords);
const SHORTHAND = fromJS(shorthand);

/**
 * pairs: List< <prop: string, val: string>>, url?: string -> Map<[prop: string]: count: number>
 *
 * Tallies the total number of valid CSS `props` in a list of `prop: val` pairs, and sorts by frequency.
 *
 * - If a `prop` is a CSS shorthand property, expand according to its value,
 * and add expansions to the total tally IN ADDITION to the shorthand `prop`.
 * - If we can't parse `val` for `prop`'s expansion, we add `prop` anyway to err on the side of over-inclusion. #liberalism
 */
export default function tallyKeywords (pairs, url = null) {
  // If pairs is empty, we are done
  if (pairs.isEmpty()) {
    logExceptOnTest(warning('No keywords given for url')(url));
    throw new Error('No keywords given for url', url);
  }

  // Filter out invalid keywords
  const pruned = pairs.filter(
    pair => KEYWORDS.includes(pair.first())
  );

  // Now expand shorthand properties
  const expanded = pruned.flatMap((pair) => {
    const prop = pair.first();
    let result;

    // If `prop` is a shorthand property, expand it according
    // to its value.
    if (SHORTHAND.includes(prop)) {
      const expansion = expand(...pair);

      // Return the expanded properties if they exist, else null
      const subprops = expansion ? List(Object.keys(expansion)) : null;
      if (!subprops) {
        logExceptOnTest(warning('Couldn\'t parse value of prop')(prop));
      }

      // Add the shorthand `prop` to the results list, too
      result = List([prop]).concat(subprops);
    } else {
      // If `prop` isn't shorthand, we just return it
      // in a single-element List to honor the List.map() contract.
      result = List([prop]);
    }

    return result;
  });

  if (expanded.isEmpty()) {
    logExceptOnTest(warning('No valid keywords for url')(url));
    throw new Error('No valid keywords for url', url);
  }

  // Sum up the total count of each `prop` in a new Map
  const total = expanded.reduce(
    (count, token) => count.update(token, 0, n => n + 1),
    Map()
  );

  return total;
}
