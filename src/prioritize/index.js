import processUrl from '../scraping';
import { reduceDataBulk } from './reduceData';
import makePrediction from './makePrediction';
import { fromJS } from 'immutable';
import { logExceptOnTest } from '../utils/msg';

/**
 * urls: List<string>
 * -> Promise < [ OrderedMap<[prop: string]: count: number>, number ] >
 *
 * Given a List of source URLs for a technique, compute a prediction
 * of likely `props` as an OrderedMap.
 */
export default function computePrediction (urls) {
  return new Promise((resolve, reject) => {
    Promise.all(urls.map(processUrl))
      .then(fromJS)  // Convert to Immutable List
      .then(urlResults => urlResults.filter(
        tallies => !tallies.isEmpty()
      ))
      .then(reduceDataBulk)  // TODO: pull cached prediction from DB
      .then(pair => makePrediction(...pair))
      .then(prediction => resolve(prediction))
      .catch(err => {
        logExceptOnTest(err);
        reject(err);
      });
  });
}
