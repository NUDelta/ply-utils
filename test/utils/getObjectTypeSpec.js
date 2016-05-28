import { expect } from 'chai';
import { Map, OrderedMap, List } from 'immutable';
import { getObjectType } from '../../src/utils/getObjectType';

/* eslint quote-props: "off", no-undef: "off", no-unused-expressions: "off" */

describe('getObjectType', () => {
  it('identifies Immutable OrderedMaps', () => {
    const input = OrderedMap();
    const expected = 'ImmutableOrderedMap';
    const result = getObjectType(input);

    expect(result).to.equal(expected);
  });

  it('identifies Immutable Maps', () => {
    const input = Map();
    const expected = 'ImmutableMap';
    const result = getObjectType(input);

    expect(result).to.equal(expected);
  });

  it('identifies Immutable Lists', () => {
    const input = List();
    const expected = 'ImmutableList';
    const result = getObjectType(input);

    expect(result).to.equal(expected);
  });

  it('identifies JS Objects', () => {
    const input = {};
    const expected = 'JSObject';
    const result = getObjectType(input);

    expect(result).to.equal(expected);
  });

  it('identifies JS Arrays', () => {
    const input = [];
    const expected = 'JSArray';
    const result = getObjectType(input);

    expect(result).to.equal(expected);
  });

  it('throws for an unrecognized type', () => {
    const input = 4;
    expect(() => getObjectType(input)).to.throw('Unrecognized type');
  });
});
