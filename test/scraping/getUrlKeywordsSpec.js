import { expect } from 'chai';
import { fromJS, Map } from 'immutable';
import getUrlKeywords from '../../src/scraping';

/* eslint quote-props: "off", no-undef: "off", no-unused-expressions: "off" */

describe('getUrlKeywords', () => {
  it('resolves to an Map for a valid URL', () => {
    const input = 'http://www.minimit.com/articles/solutions-tutorials/fullscreen-backgrounds-with-centered-content';
    const expected = fromJS({
      'height': 3,
      'background-position': 2,
      'display': 2,
      'background-repeat': 1,
      'vertical-align': 1,
      'position': 1,
      'width': 1,
      'text-align': 1,
      'min-height': 1,
      'overflow': 1
    });
    const result = getUrlKeywords(input);
    return expect(result).to.eventually.equal(expected);
  });

  it('resolves to an empty Map given an invalid URL', () => {
    const input = 'http://www';
    const expected = Map();
    const result = getUrlKeywords(input);
    return expect(result).to.eventually.equal(expected);
  });

  it('resolves to an empty Map given a URL with no valid tokens', () => {
    const input = 'http://adamkaplan.me/grid/';
    const expected = Map();
    const result = getUrlKeywords(input);
    return expect(result).to.eventually.equal(expected);
  });
});
