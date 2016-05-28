import processUrl from '../scraping';
import { reduceDataBulk } from './reduceData';
import { fromJS } from 'immutable';
import { logExceptOnTest } from '../utils/msg';

/**
 * urls: List<url: string>
 * -> Promise < [ OrderedMap<[prop: string]: count: number>, number ] >
 *
 * Given a List of source URLs for a technique, compute the distribution
 * of likely `props` as an OrderedMap.
 */
export function computeDistribution (urls) {
  return new Promise((resolve, reject) => {
    Promise.all(urls.map(processUrl))
      .then((res) => {
        // Convert to Immutable List, filter out sites with
        // no results
        const totals = fromJS(res)
          .filter(tallies => !tallies.isEmpty());

        // Eventually will hook into the DB here to get the
        // technique distribution
        const dist = reduceDataBulk(totals);
        resolve(...dist);
      })
      .catch(err => {
        logExceptOnTest(err);
        reject(err);
      });
  });
}
