import fs from 'fs-extra';
import path from 'path';
import { List, fromJS } from 'immutable';

export const SRC = path.join(__dirname, '../../input');
export const DEST = path.join(__dirname, '../../output');

/*
 * Walks a directory and returns an Immutable List of the
 * directory contents.
 */
function walkDir (dir) {
  fs.ensureDirSync(dir);
  const files = fromJS(fs.readdirSync(dir));
  return files;
}

/*
 * Reads a file and returns an Immutable List of the form
 * [FileName, [FileLines]].
 */
function readFile (file) {
  const urls = fs.readFileSync(path.join(SRC, file))
    .toString()
    .split('\n');

  const info = List.of(file, urls);
  return info;
}

/*
 * Takes a directory and returns an Immutable List of Immutable List pairs
 * [Technique: String, List<URL: String>]
 */
export function getTechniques (dir) {
  const techniques = fromJS(
    walkDir(dir).map(readFile)
  );
  return techniques;
}
