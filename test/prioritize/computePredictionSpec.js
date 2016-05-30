import { expect } from 'chai';
import { List, Map, fromJS } from 'immutable';
import computePrediction from '../../src/prioritize';

/* eslint quote-props: "off", no-undef: "off", no-unused-expressions: "off" */

describe('computePrediction', () => {
  it('returns a prediction given a list of URLs', () => {
    const input = List([
      'http://jsbin.com/secofuz/',
      'http://jsbin.com/wakiyub/',
    ]);
    const expected = fromJS([
      {
        2: [
          'padding-right',
          'padding-left',
          'background-color',
        ],
        1: [
          'font-family',
          'color',
          'margin-left',
          'background-position',
          'margin-bottom',
          'background',
          'margin',
          'margin-top',
          'background-repeat',
          'background-image',
          'margin-right',
          'font-size',
        ],
      },
      2
    ]);

    const result = computePrediction(input);

    return expect(result).to.eventually.eql(expected);
  });

  it('returns an empty Map given no URLs', () => {
    const input = List([]);
    const expected = List.of(Map(), 0);
    const result = computePrediction(input);
    return expect(result).to.eventually.eql(expected);
  });

  it('does not count URLs with invalid entries', () => {
    const input = List([
      'http://jsbin.com/secofuz/',
      'http://jksd',
      'http://jsbin.com/wakiyub/',
    ]);
    const expected = fromJS([
      {
        2: [
          'padding-right',
          'padding-left',
          'background-color',
        ],
        1: [
          'font-family',
          'color',
          'margin-left',
          'background-position',
          'margin-bottom',
          'background',
          'margin',
          'margin-top',
          'background-repeat',
          'background-image',
          'margin-right',
          'font-size',
        ],
      },
      2
    ]);

    const result = computePrediction(input);

    return Promise.all([
      expect(result).to.eventually.eql(expected)
    ]);
  });
});
