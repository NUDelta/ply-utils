import path from 'path';
import firebase from 'firebase';
import { error, update, logExceptOnTest } from './utils/msg';
import { fromJS } from 'immutable';
import chalk from 'chalk';

firebase.initializeApp({
  serviceAccount: path.join(__dirname, '../secrets/fbAuth.json'),
  databaseURL: 'https://ply-app.firebaseio.com/',
});

const db = firebase.database();
const ref = db.ref();
const priorities = ref.child('priorities');

/*
 * Retrieves the priorities object for a given technique.
 * TODO: make this live-updating
 */
export function getPriority (technique) {
  return new Promise((resolve, reject) => {
    priorities.once('value', (snapshot) => {
      const res = snapshot.val();
      if (res === null) {
        const err = error('No prioritization found for ') + chalk.red.underline(technique);
        reject(err); return;
      }
      // Convert to Immutable Map
      const totalsMap = fromJS(res);
      resolve(totalsMap);
    });
  });
}

/*
 * Sets the priorities object for a given technique.
 * If successful, returns the priorities object.
 */
export function setPriority (technique, totals) {
  return new Promise((resolve, reject) => {
    logExceptOnTest(update('Setting priorities for'), chalk.underline.cyan(technique));
    const techniqueRef = priorities.child(technique);

    // Convert `totals` from an Immutable Map to a JS object for Firebase
    const prioritiesObj = totals.toJS();

    techniqueRef.set(prioritiesObj, (err) => {
      if (err) {
        logExceptOnTest(error('Could not set priorities for'), chalk.underline.red(technique));
        reject(err); return;
      }
      resolve(totals);
    });
  });
}

// For testing only
// getPriority('responsive-grid')
//   .then(snapshot => console.log(snapshot.val()))
//   .catch(err => console.log(err));
