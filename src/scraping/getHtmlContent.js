import request from 'request';
import { logExceptOnTest, error } from '../utils/msg';

/**
 * url: string -> Promise<string>
 *
 * Requests the body of a provided url.
 */
export default function getHtmlContent (url) {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (err) {
        logExceptOnTest(error('Couldn\'t retrieve body for url')(url));
        reject(err);
        return;
      }
      resolve(body, url);
    });
  });
}
