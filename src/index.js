import { getTechniques } from './utils/fileTools';
import computePrediction from './prioritize';
import { printData, logExceptOnTest, update } from './utils/msg';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

/**
 * Driver for the filesystem-based interface.
 * Reads files from the input directory, treating each file
 * as a list of source URLs for a technique.
 *
 * Computes predictions for each technique and writes the result
 * as a JSON object to the output directory.
 */
export default function driver () {
  // Read from input files
  const techniques = getTechniques('./input');

  techniques.forEach(pair => {
    const [technique, urls] = pair;

    logExceptOnTest(update(chalk.bold('Getting information for technique'))(chalk.bold(technique)));

    computePrediction(urls)
      .then(res => {
        // Add the technique name to the prediction, creating a 3-tuple
        const bundle = res.unshift(technique);
        return bundle;
      })
      .then((bundle) => {
        // Write JSON output to file
        const [technique, prediction, count] = bundle;
        const dest = path.join(__dirname, '../output');

        // TODO: async lol
        fs.ensureDirSync(dest);
        fs.writeFileSync(path.join(dest, technique), JSON.stringify(bundle));

        return [technique, prediction, count];
      })
      .then(printData)
      .catch(err => console.log(err));
  });  
}
