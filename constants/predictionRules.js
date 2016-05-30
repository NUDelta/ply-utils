/**
 * Default rules for prioritizing `props`.
 * Assumes reduction used the default binary fn.
 */

/* eslint no-confusing-arrow: "off" */

export default (n) => {
  /* - If n == 1,
   *     return 2
   */
  if (n === 1) return () => '2';

  /* - If n == 2,
   *     return 2 if it appears in both
   *     return 1 otherwise
   */
  if (n === 2) return (x) => (x >= 2) ? '2' : '1';

  /* - If n is between 3 and 5,
   *     return 3 if it appears in at least n - 1
   *     return 2 otherwise
   */
  if (n <= 5) return (x) => (x >= n - 1) ? '3' : '2';

  /* - If n is between 5 and 10,
   *     return 3 if it appears in at least 75%
   *     return 2 if it appears in at least 50%
   *     return 1 otherwise
   *
   * - TODO: If n is greater than 10,
   *     follow all rules for 'greater than 5'
   *     return 0 for the complement of properties
   */
  return (x) => {
    if (x >= Math.floor(0.75 * n)) return '3';
    else if (x >= Math.floor(0.5 * n)) return '2';
    return '1';
  };
};
