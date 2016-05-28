import { expect } from 'chai';
import { fromJS } from 'immutable';
import appendSnippets from '../fixtures/dom_mocker';
import snippets from '../fixtures/stubs/snippets';

import parseKeywords from '../../src/scraping/parseKeywords';

/* eslint quote-props: "off", no-undef: "off", no-unused-expressions: "off" */

describe('parseKeywords', () => {
  it('parses an HTMLString into a List of <Property, Value> pairs', () => {
    const snips = snippets.slice(0, 2);
    const input = appendSnippets(snips);
    const expected = fromJS([
        ['margin', '10px'],
        ['padding-left', '10px'],
        ['padding-right', '10px'],
        ['font-family', "'Georgia', 'Times New Roman', serif"],
        ['font-size', '1rem'],
    ]);

    const result = parseKeywords(input);
    expect(result).to.equal(expected);
  });

  it('throws a warning if no properties are found', () => {
    const input = appendSnippets([]);
    expect(() => parseKeywords(input, 'test.com')).to.throw('Unable to find any CSS properties in URL');
  });

  it('checks code blocks if no pre blocks are found', () => {
    const input = appendSnippets([`
      <code>.foo { margin: 0 auto; }</code>
    `]);
    const result = parseKeywords(input, 'test.com');
    const expected = fromJS([
      ['margin', '0 auto']
    ]);
    expect(result).to.equal(expected);
  });

  it('handles badly formed inputs', () => {
    const input = appendSnippets([`<pre><code>.foo { margin: 0 auto; }
.bar {
  float:left;
  fllf: url(/hello/bye.png)
  content: ''
}
      </code></pre>`], false);
    const result = parseKeywords(input, 'test.com');
    const expected = fromJS([
      ['margin', '0 auto'],
      ['float', 'left'],
      ['fllf', 'url(/hello/bye.png)'],
      ['content', '\'\''],
    ]);
    expect(result).to.equal(expected);
  });

  it('doesn\'t freak out if we don\'t pass a url and always returns a List', () => {
    expect(() => parseKeywords('')).to.throw('Unable to find any CSS properties in URL');
  });
});
