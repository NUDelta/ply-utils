import { expect } from 'chai';
import { OrderedMap, List, Map } from 'immutable';
import { binary, reduceData } from '../../src/prioritize/reduceData';

/* eslint quote-props: "off", no-undef: "off", no-unused-expressions: "off" */

describe('binary', () => {
  it('returns an empty OrderedMap given an empty input', () => {
    const input = OrderedMap();
    const expected = OrderedMap();
    const result = binary(input);
    expect(result).to.equal(expected);
  });

  it('returns an OrderedMap with all values set to 1', () => {
    
  });
});

describe('reduceData', () => {
  it('reduces a list of props to one OrderedMap with the default function', () => {
    const input = List([
      OrderedMap({
        'float': 3,
        'margin-left': 2,
      }),
      OrderedMap({
        'vertical-align': 1,
        'font-family': 1,
      }),
    ]);
    const expected = OrderedMap({
      'font-family': 1,
      'vertical-align': 1,
      'margin-left': 1,
      'float': 1,
    });
    const result = reduceData(input);
    expect(result).to.equal(expected);
  });

  it('reduces with an arbitrary helper function', () => {
    const input = List([
      OrderedMap({
        'float': 3,
        'margin-left': 2,
      }),
      OrderedMap({
        'vertical-align': 1,
        'font-family': 1,
      }),
    ]);
    const expected = OrderedMap({
      'margin-left': 5,
      'float': 5,
      'font-family': 0,
      'vertical-align': 0,
    });
    const result = reduceData(input, Map(), (tallies) =>
      tallies.map(count => {
        if (count > 1) return 5;
        return 0;
      })
    );
    expect(result).to.equal(expected);
  });

  it('reduces into a supplied initial OrderedMap value', () => {
    const init = OrderedMap({
      'float': 2,
      'margin-left': 1,
      'font-family': 1,
      'vertical-align': 1,
    });
    const input = List([
      OrderedMap({
        'float': 3,
        'margin-left': 2,
      }),
      OrderedMap({
        'vertical-align': 1,
        'font-family': 1,
      }),
    ]);
    const expected = OrderedMap({
      'float': 3,
      'vertical-align': 2,
      'font-family': 2,
      'margin-left': 2,
    });
    const result = reduceData(input, init);
    expect(result).to.equal(expected);
  });

  it('reduces into a supplied initial OrderedMap value, given a single-item list', () => {
    const init = OrderedMap({
      'float': 2,
      'margin-left': 1,
      'font-family': 1,
      'vertical-align': 1,
    });
    const input = List([
      OrderedMap({
        'float': 3,
        'margin-left': 2,
      })
    ]);
    const expected = OrderedMap({
      'float': 3,
      'margin-left': 2,
      'vertical-align': 1,
      'font-family': 1,
    });
    const result = reduceData(input, init);
    expect(result).to.equal(expected);
  });
});
