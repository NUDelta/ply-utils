import request from 'request';
import {List, Map, fromJS, forEach} from 'immutable';
import cheerio from 'cheerio';
import async from 'async';
import keywords from '../keywords';
import {printData} from './utils/io';

const KEYWORDS = fromJS(keywords);

/*
 * Returns a Promise for the body of the given URL.
 */
function getHtmlContent (url) {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (err) {
        reject(err);
        return;
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
  console.log($('pre').text());
  const blocks = $('pre').text()  // Load the combined text content of all matched elements
    .replace(/:/g, ': ');  // HACK: add spaces after colons so filtering works
  
  const tokens = blocks.split(/[\s;]+/);
  const tallies = tokens.filter(tk => tk.charAt(tk.length - 1) === ':')
    .map(tk => tk.slice(0, tk.length - 1))
    .filter(tk => KEYWORDS.indexOf(tk) !== -1)
    .reduce(
      (acc, tk) => acc.update(tk, 0, count => count + 1),
      Map()
    );

  return tallies;
}

/*
 * Asynchronously converts a URL into a feature vector of
 * CSS properties and their frequencies.
 */
function extractFeatures (url, cb) {
  getHtmlContent(url)
    .then(countKeywords)
    .then(tallies => cb(null, tallies))
    .catch(err => cb(err, null));
}

/*
 * Takes an array of URLs and a callback function.
 * Asynchronously converts each URL into the feature vector for
 * the corresponding website, then invokes the callback with the
 * fully transformed List.
 */
export function getAllFeatures (urls, cb) {
  const features = async.map(
    urls,
    extractFeatures,
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }

      // `results` is the image of the original array
      // Remove all empty elements before passing to the callback
      const instances = List(results).filter(tallies => !tallies.isEmpty());
      printData(instances);
      cb(instances);
    }
  );
}

function classify (instances) {
  // Convert the instances to an Immutable List if not already
  const dataset = List(instances);

  if (dataset.isEmpty()) {
    console.log('ERROR: all instances empty');
    return false;
  }

  // Normalize instance vectors by setting every property's count to 1
  const normalized = dataset.map(tallies => tallies.map(count => 1));
  const n = normalized.size;

  // Merge objects into a super-object
  const distrib = normalized.reduce(
    (acc, instance) => acc.mergeWith((prev, next) => prev + next, instance),
    Map()
  );

  printData(distrib.sort().reverse());
}

const urls = [
  'http://www.minimit.com/articles/solutions-tutorials/fullscreen-backgrounds-with-centered-content',
  'http://sixrevisions.com/css/responsive-background-image/',
  'https://css-tricks.com/perfect-full-page-background-image/',
  'https://www.webdesign.org/absolutely-responsive-full-screen-background-images.22549.html',
  'http://stradegyadvertising.com/css-create-fullscreen-background-image/',
];

getAllFeatures(urls, classify);


// export function extractFeatures (url) {
//   getHtmlContent(url)
//     .then(countKeywords)
//     .then(tallies => console.log(JSON.stringify(tallies, null, 4)))
//     .catch(err => console.error(err));
// }
