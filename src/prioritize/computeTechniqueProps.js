import processUrl from '../scraping';
import { reduceDataBulk } from './reduceData';
import { logExceptOnTest } from '../utils/msg';

/**
 * urls: List<url: string> -> OrderedMap<[prop: string]: count: number>
 *
 * Given a List of source URLs for a technique, compute the distribution
 * of likely `props` as an OrderedMap.
 */
export function computeDistribution (urls) {
  return new Promise((resolve, reject) => {
    Promise.all(urls.map(processUrl))
      .then((res) => {
        const dist = reduceDataBulk(res);
        resolve(dist);
      })
      .catch(err => {
        logExceptOnTest(err);
        reject(err);
      });
  });
}
