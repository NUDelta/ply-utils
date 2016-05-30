import { expect } from 'chai';
import { Map, List, fromJS } from 'immutable';
import { binary, reduceDataBulk, reduceDataSingle } from '../../src/prioritize/reduceData';

/* eslint quote-props: "off", no-undef: "off", no-unused-expressions: "off" */

describe('binary', () => {
  it('returns an empty Map given an empty input', () => {
    const input = Map();
    const expected = Map();
    const result = binary(input);
    expect(result).to.equal(expected);
  });

  it('returns an Map with all values set to 1', () => {
    const input = Map({
      'foo': 4,
      'bar': -2,
      'baz': 30,
    });

    const expected = Map({
      'foo': 1,
      'bar': 1,
      'baz': 1,
    });

    const result = binary(input);
    expect(result).to.equal(expected);
  });
});

describe('reduceDataBulk', () => {
  it('reduces a list of props to one [Map, n] pair with the default function', () => {
    const input = List([
      Map({
        'float': 3,
        'margin-left': 2,
      }),
      Map({
        'vertical-align': 1,
        'font-family': 1,
      }),
    ]);

    const expected = fromJS([
      {
        'font-family': 1,
        'vertical-align': 1,
        'margin-left': 1,
        'float': 1,
      },
      2
    ]);

    const result = reduceDataBulk(input);
    expect(result).to.eql(expected);
  });

  it('reduces with an arbitrary helper function', () => {
    const input = List([
      Map({
        'float': 3,
        'margin-left': 2,
      }),
      Map({
        'vertical-align': 1,
        'font-family': 1,
      }),
    ]);

    const expected = fromJS([
      {
        'margin-left': 5,
        'float': 5,
        'font-family': 1,
        'vertical-align': 1,
      },
      2
    ]);

    const result = reduceDataBulk(input, [Map(), 0], (tallies) =>
      tallies.map(count => {
        if (count > 1) return 5;
        return 1;
      })
    );
    expect(result).to.eql(expected);
  });

  it('reduces into a supplied initial [Map, count] pair', () => {
    const init = [
      Map({
        'float': 2,
        'margin-left': 1,
        'font-family': 1,
        'vertical-align': 1,
      }),
      3
    ];

    const input = List([
      Map({
        'float': 3,
        'margin-left': 2,
      }),
      Map({
        'vertical-align': 1,
        'font-family': 1,
      }),
    ]);

    const expected = fromJS([
      {
        'float': 3,
        'vertical-align': 2,
        'font-family': 2,
        'margin-left': 2,
      },
      5
    ]);

    const result = reduceDataBulk(input, init);
    expect(result).to.eql(expected);
  });

  it('behaves identically to reduceDataSingle, given a single-item list', () => {
    const init = [
      Map({
        'float': 2,
        'margin-left': 1,
        'font-family': 1,
        'vertical-align': 1,
      }),
      5
    ];

    const input = Map({
      'float': 3,
      'margin-left': 2,
    });

    const expected = reduceDataSingle(input, init);

    const result = reduceDataBulk(List([input]), init);
    expect(result).to.equal(expected);
  });

  it('filters out zero-valued props after reducing', () => {
    const input = List([
      Map({
        'float': 3,
        'margin-left': 2,
      }),
      Map({
        'vertical-align': 1,
        'font-family': 1,
      }),
    ]);

    const expected = fromJS([
      {
        'margin-left': 5,
        'float': 5,
      },
      2
    ]);

    const result = reduceDataBulk(input, List.of(Map(), 0), (tallies) =>
      tallies.map(count => {
        if (count > 1) return 5;
        return 0;
      })
    );
    expect(result).to.equal(expected);
  });
});

describe('reduceDataSingle', () => {
  it('reduces a single Map with the default function', () => {
    const input = Map({
      'float': 3,
      'margin-left': 2,
    });

    const expected = fromJS([
      {
        'margin-left': 1,
        'float': 1,
      },
      1
    ]);

    const result = reduceDataSingle(input, [Map(), 0]);
    expect(result).to.eql(expected);
  });

  it('reduces a single Map with an arbitrary helper function', () => {
    const input = Map({
      'float': 10,
      'margin-left': 1,
    });

    const expected = fromJS([
      {
        'float': 5,
        'margin-left': 1,
      },
      1
    ]);

    const result = reduceDataSingle(input, List.of(Map(), 0), (tallies) =>
      tallies.map(count => {
        if (count > 1) return 5;
        return 1;
      })
    );
    expect(result).to.equal(expected);
  });

  it('filters out zero-valued props after reducing', () => {
    const input = Map({
      'float': 10,
      'margin-left': 1,
    });

    const expected = fromJS([
      {
        'float': 5,
      },
      1
    ]);

    const result = reduceDataSingle(input, List.of(Map(), 0), (tallies) =>
      tallies.map(count => {
        if (count > 1) return 5;
        return 0;
      })
    );
    expect(result).to.equal(expected);
  });

  it('reduces into a supplied initial Map value', () => {
    const init = [
      Map({
        'margin-left': 1,
        'float': 2,
        'font-family': 1,
        'vertical-align': 1,
      }),
      4
    ];

    const input = Map({
      'float': 3,
      'margin-left': 2,
    });

    const expected = fromJS([
      {
        'float': 3,
        'margin-left': 2,
        'font-family': 1,
        'vertical-align': 1,
      },
      5
    ]);

    const result = reduceDataSingle(input, init);
    expect(result).to.equal(expected);
  });
});
