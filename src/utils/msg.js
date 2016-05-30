import chalk from 'chalk';

export function logExceptOnTest (str) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(str);
  }
}

export function error (text) {
  return (em) =>
    chalk.red(
      chalk.bold('\tERROR!'),
      text,
      em ? chalk.underline(em) : ''
    );
}

export function warning (text) {
  return (em) =>
    chalk.yellow(
      chalk.bold('\tWARNING:'),
      text,
      em ? chalk.underline(em) : ''
    );
}

export function update (text) {
  return (em) =>
    chalk.cyan(
      text,
      em ? chalk.underline(em) : ''
    );
}

/* eslint-disable */

function syntaxHighlight (json) {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, undefined, 2);
  }

  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        return chalk.green(match);
      } else {
        return chalk.red(match);
      }
    } else if (/true|false/.test(match)) {
      return chalk.yellow(match);
    } else if (/null/.test(match)) {
      return chalk.gray(match);
    } else {
      // Number
      return chalk.white(match);
    }
  });
}


/*
 * Nicely prints JSON to the command line
 */
export function printData (data) {
  // spacing level = 2
  logExceptOnTest(
    syntaxHighlight(JSON.stringify(data, null, 2))
  );
}
