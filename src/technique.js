import {fromJS, List, Map} from 'immutable';

/*
  "responsive-background": {
    "tutorials": [],
    "examples": [],
    "features": [],
    "guess": {
      "0": [],
      "1": [],
      "2": []
    }
  }

 */

export default function create () {
  return Map();
}

/*
 * Produces the initial examples List
 */
export function setExamples (technique, examples) {
  return technique.set('examples', List(examples));
}

/*
 * Produces the initial tutorials List
 */
export function setTutorials (technique, tutorials) {
  return technique.set('tutorials', List(tutorials));
}

/*
 * Produces the initial features List
 */
export function setFeatures (technique, features) {
  return technique.set('features', List(features));
}

/*
 * Produces the initial guess Map
 */
export function setGuess (technique, guess) {
  return technique.set('features', Map(guess));
}
