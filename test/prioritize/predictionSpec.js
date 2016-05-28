import { expect } from 'chai';
import { OrderedMap, List } from 'immutable';
import { prediction } from '../../src/prioritize/prediction';

/* eslint quote-props: "off", no-undef: "off", no-unused-expressions: "off" */

describe('prediction', () => {
  it('partitions properties with a default function', () => {
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
    
    const results = prediction(input, 10);

    expect(results.get(3)).to.eql(List([
      'background-color',
      'padding-left',
      'padding-right',
      'font-size',
    ]));

    expect(results.get(2)).to.eql(List([
      'margin-right',
      'background-image',
    ]));

    expect(results.get(1)).to.eql(List([
      'background-repeat',
      'margin-top',
      'margin',
      'background',
    ]));
  });

  it('partitions properties with a custom function', () => {
    return false;
  });

  it('uses a function with a variable number of rules', () => {
    return false;
  });
});
