import { expect } from 'chai';
import { fromJS, OrderedMap, List } from 'immutable';
import DEFAULT_RULES from '../../constants/predictionRules';

/* eslint quote-props: "off", no-undef: "off", no-unused-expressions: "off" */

describe('default prediction rules', () => {
  it('always returns 2 if n = 1', () => {
    const n = 1;
    const inputs = List([1, 2, 3]);
    const expected = List([2, 2, 2]);
    const rules = DEFAULT_RULES(n);
    const results = inputs.map(rules);
    expect(results).to.eql(expected);
  });

  it('behaves for n = 2', () => {
    const n = 2;
    const inputs = List([1, 2]);
    const expected = List([1, 2]);
    const rules = DEFAULT_RULES(n);
    const results = inputs.map(rules);
    expect(results).to.eql(expected);
  });

  it('behaves for 3 <= n <= 5', () => {
    const n = 5;
    const inputs = List([1, 2, 4]);
    const expected = List([2, 2, 3]);
    const rules = DEFAULT_RULES(n);
    const results = inputs.map(rules);
    expect(results).to.eql(expected);
  });

  it('behaves for n > 5', () => {
    const n = 10;
    const inputs = List([1, 5, 8]);
    const expected = List([1, 2, 3]);
    const rules = DEFAULT_RULES(n);
    const results = inputs.map(rules);
    expect(results).to.eql(expected);
  });

  it('can be used as an Immutable grouper', () => {
    const n = 10;
    const rules = DEFAULT_RULES(n);

    const input = OrderedMap({
      'background-color': 10,
      'padding-left': 9,
      'padding-right': 8,
      'font-size': 7,
      'margin-right': 6,
      'background-image': 5,
      'background-repeat': 4,
      'margin-top': 3,
      'margin': 2,
      'background': 1,
    });
    const expected = OrderedMap({
      3: OrderedMap({
        'background-color': 10,
        'padding-left': 9,
        'padding-right': 8,
        'font-size': 7,
      }),
      2: OrderedMap({
        'margin-right': 6,
        'background-image': 5,
      }),
      1: OrderedMap({
        'background-repeat': 4,
        'margin-top': 3,
        'margin': 2,
        'background': 1,
      }),
    })
    .reverse()
    .toJS();  // HACK: Immutable converts keys to strings
    
    const results = input.groupBy(rules).toJS();
    expect(results).to.eql(expected);
  });
});
