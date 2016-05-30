import { expect } from 'chai';
import { List, Map, fromJS } from 'immutable';
import { jsToImmutable, immutableToJS } from '../../src/utils/immutableHelpers';
import makePrediction from '../../src/prioritize/makePrediction';

/* eslint quote-props: "off", no-undef: "off", no-unused-expressions: "off" */

describe('makePrediction', () => {
  it('partitions properties with a default function', () => {
    const input = Map({
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

    const [expectedObj, expectedCount] = fromJS([
      {
        2: [
          'background-image',
          'margin-right',
        ],
        1: [
          'background',
          'margin',
          'margin-top',
          'background-repeat',
        ],
        3: [
          'padding-right',
          'padding-left',
          'background-color',
          'font-size',
        ],
      },
      10
    ]);
    
    const [resultsObj, resultsCount] = makePrediction(input, 10);
    expect(resultsCount).to.equal(expectedCount);
    expect(resultsObj).to.eql(expectedObj);
    // expect(resultsObj.toJS()).to.eql(expectedObj);
  });
});
