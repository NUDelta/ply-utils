import { expect } from 'chai';
import { OrderedMap, List, Map } from 'immutable';
import { binary, reduceDataBulk, reduceDataSingle } from '../../src/prioritize/reduceData';

/* eslint quote-props: "off", no-undef: "off", no-unused-expressions: "off" */

describe('binary', () => {
  it('returns an empty OrderedMap given an empty input', () => {
    const input = OrderedMap();
    const expected = OrderedMap();
    const result = binary(input);
    expect(result).to.equal(expected);
  });

  it('returns an OrderedMap with all values set to 1', () => {
    const input = OrderedMap({
      'foo': 4,
      'bar': -2,
      'baz': 30,
    });

    const expected = OrderedMap({
      'foo': 1,
      'bar': 1,
      'baz': 1,
    });

    const result = binary(input);
    expect(result).to.equal(expected);
  });
});

describe('reduceDataBulk', () => {
  it('reduces a list of props to one [OrderedMap, n] pair with the default function', () => {
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

    const expected = [
      OrderedMap({
        'font-family': 1,
        'vertical-align': 1,
        'margin-left': 1,
        'float': 1,
      }),
      2
    ];

    const result = reduceDataBulk(input);
    expect(result).to.eql(expected);
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

    const expected = [
      OrderedMap({
        'margin-left': 5,
        'float': 5,
        'font-family': 1,
        'vertical-align': 1,
      }),
      2
    ];

    const result = reduceDataBulk(input, [Map(), 0], (tallies) =>
      tallies.map(count => {
        if (count > 1) return 5;
        return 1;
      })
    );
    expect(result).to.eql(expected);
  });

  it('reduces into a supplied initial [OrderedMap, count] pair', () => {
    const init = [
      OrderedMap({
        'float': 2,
        'margin-left': 1,
        'font-family': 1,
        'vertical-align': 1,
      }),
      3
    ];

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

    const expected = [
      OrderedMap({
        'float': 3,
        'vertical-align': 2,
        'font-family': 2,
        'margin-left': 2,
      }),
      5
    ];

    const result = reduceDataBulk(input, init);
    expect(result).to.eql(expected);
  });

  it('behaves identically to reduceDataSingle, given a single-item list', () => {
    const init = [
      OrderedMap({
        'float': 2,
        'margin-left': 1,
        'font-family': 1,
        'vertical-align': 1,
      }),
      5
    ];

    const input = OrderedMap({
      'float': 3,
      'margin-left': 2,
    });

    const expected = reduceDataSingle(input, init);

    const result = reduceDataBulk(List([input]), init);
    expect(result).to.eql(expected);
  });

  it('filters out zero-valued props after reducing', () => {
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

    const expected = [
      OrderedMap({
        'margin-left': 5,
        'float': 5,
      }),
      2
    ];

    const result = reduceDataBulk(input, [Map(), 0], (tallies) =>
      tallies.map(count => {
        if (count > 1) return 5;
        return 0;
      })
    );
    expect(result).to.eql(expected);
  });
});

describe('reduceDataSingle', () => {
  it('reduces a single OrderedMap with the default function', () => {
    const input = OrderedMap({
      'float': 3,
      'margin-left': 2,
    });

    const expected = [
      OrderedMap({
        'margin-left': 1,
        'float': 1,
      }),
      1
    ];

    const result = reduceDataSingle(input, [Map(), 0]);
    expect(result).to.eql(expected);
  });

  it('reduces a single OrderedMap with an arbitrary helper function', () => {
    const input = OrderedMap({
      'float': 10,
      'margin-left': 1,
    });

    const expected = [
      OrderedMap({
        'float': 5,
        'margin-left': 1,
      }),
      1
    ];

    const result = reduceDataSingle(input, [Map(), 0], (tallies) =>
      tallies.map(count => {
        if (count > 1) return 5;
        return 1;
      })
    );
    expect(result).to.eql(expected);
  });

  it('filters out zero-valued props after reducing', () => {
    const input = OrderedMap({
      'float': 10,
      'margin-left': 1,
    });

    const expected = [
      OrderedMap({
        'float': 5,
      }),
      1
    ];

    const result = reduceDataSingle(input, [Map(), 0], (tallies) =>
      tallies.map(count => {
        if (count > 1) return 5;
        return 0;
      })
    );
    expect(result).to.eql(expected);
  });

  it('reduces into a supplied initial OrderedMap value', () => {
    const init = [
      OrderedMap({
        'float': 2,
        'margin-left': 1,
        'font-family': 1,
        'vertical-align': 1,
      }),
      4
    ];

    const input = OrderedMap({
      'float': 3,
      'margin-left': 2,
    });

    const expected = [
      OrderedMap({
        'float': 3,
        'margin-left': 2,
        'vertical-align': 1,
        'font-family': 1,
      }),
      5
    ];

    const result = reduceDataSingle(input, init);
    expect(result).to.eql(expected);
  });
});
