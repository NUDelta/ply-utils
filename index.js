import fs from 'fs-extra';
import path from 'path';
import byline from 'byline';
import {List, fromJS, forEach} from 'immutable';
import {extractFeatures} from './src/parseUrl';

const src = path.join(__dirname, 'input');
const dest = path.join(__dirname, 'output');

// Ensure the output directory exists, otherwise create
fs.ensureDir(dest, (err) => {
  if (err) {
    console.log(err);
  }

  // Walk over the input directory.
  // Each filename represents a technique, and the
  // contents are a list of urls to query and parse.
  const techniques = fromJS(fs.readdirSync(src));

  techniques.forEach((technique, key) => {
    // Stream the file contents line by line,
    // processing each line as a url.
    const stream = byline(fs.createReadStream(
      path.join(src, technique),
      { encoding: 'utf8' })
    );

    let counter = -1;
    let output = '';

    stream.on('data', (url) => {
      console.log('Processing', url);
      extractFeatures(url);
    });
  });

});


// .pipe(fs.createWriteStream(
//           path.join(dest, output)
//         ));