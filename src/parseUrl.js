import request from 'request';
import {List, Map, fromJS, forEach} from 'immutable';
import cheerio from 'cheerio';
import keywords from '../keywords';

const KEYWORDS = fromJS(keywords);

/*
 * Returns a Promise for the body of the given URL.
 */
function getHtmlContent (url) {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (err) {
        reject(err); return;
      }
      resolve(body);
    });
  });
}

/*
 * Returns an Immutable Map of { CSSProperty, Count } pairs,
 * each denoting the number of times the CSSProperty is mentioned
 * in `pre` tags in the given body.
 */
function countKeywords (body) {
  const $ = cheerio.load(body);
  const blocks = $('pre').text();  // Load the combined text content of all matched elements
  
  const tokens = blocks.split(/\s+/);
  const tallies = tokens.filter(tk => tk.charAt(tk.length - 1) === ':')
                        .map(tk => tk.slice(0, tk.length - 1))
                        .filter(tk => KEYWORDS.indexOf(tk) !== -1)
                        .reduce(
                          (acc, tk) => acc.update(tk, 0, count => count + 1),
                          Map()
                        );
  return tallies;
}

export function extractFeatures (url) {
  getHtmlContent(url)
    .then(countKeywords)
    .then(tallies => console.log(tallies))
    .catch(err => console.error(err));
}
