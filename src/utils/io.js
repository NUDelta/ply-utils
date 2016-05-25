/*
 * Nicely prints JSON objects and arrays to the command line
 */
export function printData (data) {
  console.log(JSON.stringify(data, null, 4));
}
