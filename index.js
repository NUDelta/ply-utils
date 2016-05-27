import { getAllFeatures } from './src/processTutorials';

// Just for testing
const urls = [
  'http://www.minimit.com/articles/solutions-tutorials/fullscreen-backgrounds-with-centered-content',
  'http://sixrevisions.com/css/responsive-background-image/',
  'https://css-tricks.com/perfect-full-page-background-image/',
  'https://www.webdesign.org/absolutely-responsive-full-screen-background-images.22549.html',
  'http://stradegyadvertising.com/css-create-fullscreen-background-image/',
];

getAllFeatures(urls);
