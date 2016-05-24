import {List, fromJS, forEach} from 'immutable';
import keywords from '../keywords';

// Freeze keywords, just to be safe
const CSS_PROPS = fromJS(keywords);

const blocks = Array.from(document.querySelectorAll('pre'));
const contents = blocks.map((el) => el.textContent);

/* [<pre>] -> Void
 * Displays snippets on page
 */
const displaySnippets = (snippets) => {
    let results = document.createElement('div');
    results.className = 'results';
    
    // Strip each snippet down to plaintext
    snippets.forEach(function (pre) {
        let stripped = document.createElement('pre');
        stripped.textContent = pre.textContent;
        results.appendChild(stripped);
    });

    // Replace the contents of the document body with the matched snippets
    let body = document.getElementsByTagName('body')[0];
    body.innerHTML = '';
    body.appendChild(results);
}

/* [String], [String] -> {String: Number}
 * Takes a list of snippet contents and a list of keywords
 * Counts the total number of times each keyword appears over all of the snippets
 * Returns a dictionary of keyword: count pairs
 */
export function countKeywords (contents, keywords) {
    let results = {};
    contents.forEach((str) => {
        // Tokenize the content string by splitting along whitespace
        const tokens = str.split(/\s+/);

        tokens
            // Tokens ending in ':' are likely to be CSS properties
            .filter((tk) => tk.charAt(tk.length - 1) === ':')
            // Extract the property and remove false positives by checking against keyword bank
            .map((tk) => tk.slice(0, tk.length - 1))
            .filter((tk) => keywords.indexOf(tk) !== -1)
            // Update the appropriate entry in the dictionary
            .forEach((tk) => {
                if (tk in results) {
                    results[tk] += 1;
                } else {
                    results[tk] = 1;
                }
            });
    });

    return results;
}