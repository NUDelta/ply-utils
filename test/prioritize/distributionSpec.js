import { expect } from 'chai';
import { OrderedMap, List } from 'immutable';
import { computeDistribution } from '../../src/prioritize/distribution';

/* eslint quote-props: "off", no-undef: "off", no-unused-expressions: "off" */

describe('computeDistribution', () => {
  it('returns an [OrderedMap, count] pair given a list of URLs', () => {
    const input = List([
      'http://jsbin.com/secofuz/',
      'http://jsbin.com/wakiyub/',
    ]);
    const expected = [
      OrderedMap({
        'background-color': 2,
        'padding-left': 2,
        'padding-right': 2,
        'font-size': 1,
        'margin-right': 1,
        'background-image': 1,
        'background-repeat': 1,
        'margin-top': 1,
        'margin': 1,
        'background': 1,
        'margin-bottom': 1,
        'background-position': 1,
        'margin-left': 1,
        'color': 1,
        'font-family': 1,
      }),
      2
    ];
    const result = computeDistribution(input);
    return expect(result).to.eventually.eql(...expected);
  });

  it('returns an empty OrderedMap given no URLs', () => {
    const input = List([]);
    const expected = [OrderedMap(), 0];
    const result = computeDistribution(input);
    return expect(result).to.eventually.eql(...expected);
  });

  it('does not count URLs with invalid entries', () => {
    const input = List([
      'http://jsbin.com/secofuz/',
      'http://jksd',
      'http://jsbin.com/wakiyub/',
    ]);
    const expected = [
      OrderedMap({
        'background-color': 2,
        'padding-left': 2,
        'padding-right': 2,
        'font-size': 1,
        'margin-right': 1,
        'background-image': 1,
        'background-repeat': 1,
        'margin-top': 1,
        'margin': 1,
        'background': 1,
        'margin-bottom': 1,
        'background-position': 1,
        'margin-left': 1,
        'color': 1,
        'font-family': 1,
      }),
      2
    ];

    const result = computeDistribution(input);
    return expect(result).to.eventually.eql(...expected);
  });
});