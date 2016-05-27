import request from 'request';
import { List, Map, fromJS } from 'immutable';
import cheerio from 'cheerio';
import async from 'async';
import expand from 'css-shorthand-expand';
import keywords from '../constants/keywords';
import shorthand from '../constants/shorthand';
import { printData, error, warn, update } from './utils/io';

const KEYWORDS = fromJS(keywords);
const SHORTHAND = fromJS(shorthand);

/*
 * Returns a Promise for the body of the given URL.
 */
function getHtmlContent (url) {
  return new Promise((resolve, reject) => {
    // console.log(update(`Querying ${url}...`));
    request(url, (err, res, body) => {
      if (err) {
        reject(err); return;
      }
      resolve([body, url]);
    });
  });
}

/*
 * Returns an Immutable Map of { CSSProperty, Count } pairs,
 * each denoting the number of times the CSSProperty is mentioned
 * in `pre` tags in the given body.
 */
function countKeywords (res) {
  const [html, url] = res;
  const $ = cheerio.load(html);
  const matches = $('pre').text()
    .match(/[a-z\-]+:\s?[\w\s#\-%\(\)\.\/!'"]+(?=[$\n;])/gm);

  if (!matches) {
    console.log(warn('Unable to find any CSS properties in'), url);
    return null;
  }

  const pairs = fromJS(matches.map(pair => pair.split(':')));
  // => [['margin', '4px'], ['border', '1px solid black']]

  // Filter to eliminate false positive "properties"
  const tallies = pairs.filter(pair => KEYWORDS.includes(pair.first()))
    // Now expand shorthand properties
    .flatMap((pair) => {
      const prop = pair.first();
      let result;

      // If prop is a shorthand property, expand it
      if (SHORTHAND.includes(prop)) {
        const expansion = expand(...pair);

        // Return the expanded properties if they exist, else null
        result = expansion ? List(Object.keys(expansion)) : null;
        if (!expansion) console.warn('Warning: couldn\'t parse prop', prop);
      } else {
        // Property isn't shorthand, so just return the prop
        result = [prop];  // Single-element list because we're mapping
      }

      return result;
    })
    // Finally, we sum up the instances of each thing
    .reduce(
      (acc, tk) => acc.update(tk, 0, count => count + 1),
      Map()
    );
  return tallies;
}

/*
 * Called after async.map finishes converting the array of URLs to vectors.
 * Reduces a bunch of Maps into one.
 */
function classify (instances) {
  console.log(update('\nClassifying instances...'));

  const dataset = List(instances);
  if (dataset.isEmpty()) {
    console.log(error('All instances were empty'));
    return false;
  }

  // Normalize instance vectors by setting every property's count to 1
  const normalized = dataset.map(tallies => tallies.map(count => 1));

  // Merge objects into one technique-wide object
  const totals = normalized.reduce(
    (acc, instance) => acc.mergeWith((prev, next) => prev + next, instance),
    Map()
  )
  .sort()
  .reverse();

  printData(totals);
  return totals;
}

/*
 * Takes an array of URLs, asynchronously converts each
 * into the feature vector for the corresponding website,
 * then invokes `classify` with the fully transformed List.
 */
export function getAllFeatures (urls) {
  console.log(update('Querying URLs...'));
  async.map(
    urls,
    // Asynchronously converts a single URL into an Immutable Map
    // of CSS properties and their frequencies.
    (url, next) => {
      getHtmlContent(url)
        .then(countKeywords)
        .then(tallies => next(null, tallies))
        .catch(err => {
          console.log(error(err));
        });
    },
    (err, results) => {
      // After getting a feature vector for a URL, we catch/log errors,
      // and pass the vector onto the originally provided callback function.
      if (err) {
        console.log('ERROR while mapping URLs');
        console.log(error(err));
      }

      console.log(update('Finished retrieving requests.'));
      // printData(results);

      // `results` is an array of Immutable Map feature vectors
      // Remove all empty vectors before passing to the callback
      const instances = List(results).filter(tallies => tallies);
      const numRemoved = results.length - instances.size;
      console.log(update(`Removed ${numRemoved} empty instances.`));

      classify(instances);
    }
  );
}

