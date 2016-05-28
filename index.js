import { getTechniques } from './src/utils/fileTools';
import getUrlKeywords from './src/scraping';
import { printData } from './src/utils/msg';
// import { getPriority, setPriority } from './src/db';

// Just for testing
const techniques = getTechniques('./input');

techniques.forEach(pair => {
  // const technique = pair.first();
  const urls = pair.last();

  getUrlKeywords(urls.first())
    .then(res => printData(res))
    .catch(err => console.err(err));

  // getAllFeatures(technique, urls)
  //   .then(tallies => reduceTallies(technique, tallies))
  //   .catch(err => {
  //     console.log(err);
  //   });
});
