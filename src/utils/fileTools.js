import fs from 'fs-extra';
import path from 'path';
import byline from 'byline';
import { List, fromJS } from 'immutable';

const SRC = path.join(__dirname, '../../input');
const DEST = path.join(__dirname, '../../output');

/*
 * Walks a directory and returns an Immutable List of the
 * directory contents.
 */
export function walkDir (dir) {
  fs.ensureDirSync(dir);
  const files = fromJS(fs.readdirSync(dir));
  return files;
}

/*
 * Reads a file and returns an Immutable List of the form
 * [FileName, [FileLines]].
 */
export function readFile (file) {
  const urls = fs.readFileSync(path.join(SRC, file))
    .toString()
    .split('\n');

  const info = fromJS([file, urls]);
  return info;
}

// console.log(walkDir(SRC).flatMap(readFile));