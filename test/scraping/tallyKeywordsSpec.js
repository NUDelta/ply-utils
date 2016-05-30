import { expect } from 'chai';
import { fromJS, Map } from 'immutable';

import tallyKeywords from '../../src/scraping/tallyKeywords';

/* eslint quote-props: "off", no-undef: "off", no-unused-expressions: "off" */

describe('tallyKeywords', () => {
  it('tallies the total number of props and sorts', () => {
    const input = fromJS([
        ['margin-top', '10px'],
        ['margin-top', '20px'],
        ['padding-left', '10%'],
        ['font-family', "'Georgia', 'Times New Roman', serif"]
    ]);
    const expected = Map({
      'margin-top': 2,
      'font-family': 1,
      'padding-left': 1,
    });
    const result = tallyKeywords(input);
    expect(result).to.equal(expected);
  });

  it('sorts by frequency', () => {
    const input = fromJS([
        ['padding-left', '10%'],
        ['margin-top', '10px'],
        ['margin-top', '20px'],
    ]);
    const expected = Map({
      'margin-top': 2,
      'padding-left': 1,
    });
    const result = tallyKeywords(input);
    expect(result).to.equal(expected);
  });

  it('expands shorthand properties', () => {
    const input = fromJS([
      ['margin', '0 auto'],
      ['background', 'url(/path/to/image.png) no-repeat center center #fff']
    ]);
    const expected = Map({
      'margin-right': 1,
      'background-image': 1,
      'background-repeat': 1,
      'margin-top': 1,
      'margin': 1,
      'background': 1,
      'margin-bottom': 1,
      'background-position': 1,
      'margin-left': 1,
      'background-color': 1,
    });
    const result = tallyKeywords(input);
    expect(result).to.equal(expected);
  });

  it('raises a warning if a shorthand property value cannot be parsed', () => {
    const input = fromJS([
      ['background', 'url(/pa$']
    ]);
    const expected = Map({
      'background': 1,
    });
    const result = tallyKeywords(input);
    expect(result).to.equal(expected);
  });

  it('filters out invalid properties', () => {
    const input = fromJS([
      ['margin-left', 'auto'],
      ['float', 'left'],
      ['fllf', 'url(/hello/bye.png)'],
      ['content', '\'\''],
    ]);
    const expected = Map({
      'content': 1,
      'float': 1,
      'margin-left': 1,
    });
    const result = tallyKeywords(input);
    expect(result).to.equal(expected);
  });

  it('throws if the input is empty', () => {
    const input = fromJS([]);
    expect(() => tallyKeywords(input, 'test.com')).to.throw('No keywords given for url');
  });

  it('throws if the input is invalid', () => {
    const input = fromJS([
      ['kdasl', 'dsakl'],
      ['jsdkg', 'jksd'],
    ]);
    expect(() => tallyKeywords(input, 'test.com')).to.throw('No valid keywords for url');
  });
});
