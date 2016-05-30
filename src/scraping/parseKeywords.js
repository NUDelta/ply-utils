import cheerio from 'cheerio';
import { fromJS } from 'immutable';
import { warning, logExceptOnTest } from '../utils/msg';

/**
 * html: string, url?: string -> List< <prop: string, val: string> >
 *
 * Parses a HTML body for keywords, returning a List of <Property, Value> tuples.
 */
export default function parseKeywords (html, url = null) {
  const $ = cheerio.load(html);
  let text = $('pre').text();

  /* If we don't get any results for <pre>, try searching
   * <code>. We can't search both at once because Cheerio
   * will give us duplicates when <code> is nested within
   * <pre> elements.
   */
  if (text === '') {
    text += $('code').text();
  }

  const CSS_REGEXP = /[a-z\-]+:\s?[\w\s#\-%\(\)\.\/!,'"]+(?=[$\n;])/gm;
  const matches = text.match(CSS_REGEXP);

  if (!matches) {
    logExceptOnTest(warning('Unable to find any CSS properties in URL')(url));
    throw new Error('Unable to find any CSS properties in URL', url);
  }

  // Split 'prop: val' matches into <prop, val> pairs
  const pairs = matches.map(
    keyword => keyword.split(/\s?:\s?/)
  );
  // => [['margin', '4px'], ['border', '1px solid black']]

  // Convert to Immutable List before returning
  return fromJS(pairs);
}
