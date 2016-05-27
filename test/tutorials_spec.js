import { expect } from 'chai';
import { fromJS } from 'immutable';

import { countKeywords } from '../src/processTutorials';
import html from './fixtures/stubs/snippets';

/* eslint quote-props: "off", no-undef: "off" */

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
