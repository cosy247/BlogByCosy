import fs from 'fs';
import config from '../../config';
import { createContentLoader } from 'vitepress';

export default createContentLoader(`../${config.srcDir}/**.md`, {
  includeSrc: false,
  excerpt: false,
  async transform(data) {
    const readmeData = data.find((d) => d.url.toLocaleLowerCase() === '/readme.html');
    if (!readmeData) return '';
    return fs.readFileSync(`./${config.srcDir}${readmeData.url.slice(0, -4)}md`, 'utf8');
  },
});
