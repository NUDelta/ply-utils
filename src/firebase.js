import path from 'path';
import firebase from 'firebase';

firebase.initializeApp({
  serviceAccount: '../secrets/fbAuth.json',
  databaseURL: 'https://ply-app.firebaseio.com/',
});
