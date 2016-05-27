import chalk from 'chalk';

/*
 * Nicely prints JSON objects and arrays to the command line
 */
export function printData (data) {
  console.log(JSON.stringify(data, null, 4));
}

/*
 * Error
 */
export function error (str) {
  return chalk.red.bold('ERROR! ') + chalk.red(str);
}

/*
 * Warn
 */
export function warn (str) {
  return chalk.yellow.bold('WARNING: ') + chalk.yellow(str);
}

/*
 * Update
 */
export const update = chalk.cyan;

