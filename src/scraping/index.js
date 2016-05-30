import getHTMLContent from './getHTMLContent';
import parseKeywords from './parseKeywords';
import tallyKeywords from './tallyKeywords';
import { update, logExceptOnTest } from '../utils/msg';
import { Map } from 'immutable';

/* eslint no-unused-vars: "off" */
const DEFAULT = Map();

/**
 * url: string
 * -> Map<[prop: string]: count: number>
 *
 * Primary driver for scraping a single URL.
 * Requests a page contents and tallies all the keyword counts.
 */
export default function getUrlKeywords (url) {
  return new Promise((resolve, reject) => {
    logExceptOnTest(update(`\t${url}`)());

    getHTMLContent(url)
      .then(res => parseKeywords(res, url))
      .then(res => tallyKeywords(res, url))
      .then(res => resolve(res))
      .catch(err => {
        // logExceptOnTest(err);
        // Since this function is used for Promise.all(), we don't want to
        // ever reject, just resolve with a default value (in this case
        // an empty Map).
        resolve(DEFAULT);
      });
  });
}
