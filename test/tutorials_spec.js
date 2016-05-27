import { expect } from 'chai';
import { fromJS, Map } from 'immutable';

import { countKeywords, classify } from '../src/processTutorials';
import html from './fixtures/stubs/snippets';

/* eslint quote-props: "off", no-undef: "off", no-unused-expressions: "off" */

describe('countKeywords', () => {
  it('returns a distribution of CSS properties from a DOM', () => {
    const res = [html, 'http://test.com'];
    const result = countKeywords(res);

    expect(result).to.equal(fromJS({
      'margin': 1,
      'margin-left': 1,
      'margin-right': 1,
      'margin-top': 1,
      'margin-bottom': 1,
      'padding-left': 1,
      'padding-right': 1,
      'font-family': 1,
      'font-size': 1,
      'color': 1,
      'background-color': 1,
      'content': 1,
      'display': 1
    }));
  });
});

describe('classify', () => {
  it('normalizes and reduces multiple property Maps', () => {
    const input = fromJS([
      {
        'margin': 10,
        'margin-left': 1,
        'margin-right': 1,
        'margin-top': 1,
        'color': 1,
        'background-color': 1,
      },
      {
        'margin': 1,
        'margin-left': 1,
        'margin-right': 1,
        'margin-top': 1,
        'content': 1,
        'display': 1
      },
    ]);

    const result = classify('technique', input);

    expect(result).to.equal(fromJS({
      'margin': 2,
      'margin-left': 2,
      'margin-right': 2,
      'margin-top': 2,
      'color': 1,
      'background-color': 1,
      'content': 1,
      'display': 1
    })
    .sort().reverse());
  });

  it('returns false for empty techniques', () => {
    const input = fromJS([Map(), Map()]);
    const result = classify('technique', input);
    expect(result.isEmpty()).to.be.true;
  });
});
