import { expect } from 'chai';
import { Map, OrderedMap, List } from 'immutable';
import { immutableToJS, jsToImmutable } from '../../src/utils/immutableHelpers';

/* eslint quote-props: "off", no-undef: "off", no-unused-expressions: "off" */

describe('immutableHelpers', () => {
  describe('immutableToJS', () => {
    it('deeply converts OrderedMaps to objects', () => {
      const input = OrderedMap({
        'a': List([1, 2, 3]),
        'b': Map({ k: 'value' }),
        'c': 3,
      });
      const expected = {
        'a': [1, 2, 3],
        'b': { k: 'value' },
        'c': 3,
      };
      const result = immutableToJS(input);
      expect(result).to.eql(expected);
    });

    it('deeply converts Maps to objects', () => {
      const input = Map({
        'a': List([1, 2, 3]),
        'b': Map({ k: 'value' }),
        'c': 3,
      });
      const expected = {
        'a': [1, 2, 3],
        'b': { k: 'value' },
        'c': 3,
      };
      const result = immutableToJS(input);
      expect(result).to.eql(expected);
    });

    it('deeply converts Lists to arrays', () => {
      const input = List([1, List([2]), 3]);
      const expected = [1, [2], 3];
      const result = immutableToJS(input);
      expect(result).to.eql(expected);
    });

    it('acts as the identity for top-level JS types', () => {
      const inputs = [
        {
          'a': 1,
          'b': 2,
          'c': 3,
        },
        [1, 2, 3],
      ];
      expect(inputs.map(immutableToJS)).to.eql(inputs);
    });
  });

  describe('JSToImmutable', () => {
    it('deeply converts objects to Maps', () => {
      const input = {
        'a': [1, 2, 3],
        'b': { k: 'value' },
        'c': 3,
      };
      const expected = Map({
        'a': List([1, 2, 3]),
        'b': Map({ k: 'value' }),
        'c': 3,
      });
      const result = jsToImmutable(input);
      expect(result).to.eql(expected);
    });

    it('converts arrays to Lists', () => {
      const input = [1, [2, 3]];
      const expected = List([1, List([2, 3])]);
      const result = jsToImmutable(input);
      expect(result).to.eql(expected);
    });

    it('acts as the identity for Immutable types', () => {
      const inputs = [
        OrderedMap({
          'a': 1,
          'b': 2,
          'c': 3,
        }),
        Map({
          'a': 1,
          'b': 2,
          'c': 3,
        }),
        List([1, 2, 3]),
      ];
      expect(inputs.map(jsToImmutable)).to.eql(inputs);
    });
  });
});
