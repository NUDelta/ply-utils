import { getTechniques } from './src/utils/fileTools';
import { getAllFeatures } from './src/processTutorials';

// Just for testing
const techniques = getTechniques('./input');

techniques.forEach(pair => {
  const technique = pair.first();
  const urls = pair.last();
  const features = getAllFeatures(technique, urls);
  console.log(technique, features);
});
