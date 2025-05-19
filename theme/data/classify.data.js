import { createContentLoader } from 'vitepress';
import config from '../../config';

export default createContentLoader(`../${config.srcDir}/**.md`, {
  includeSrc: false,
  excerpt: false,
  async transform(data) {
    const posts = data.filter((d) => d.frontmatter.id && !d.url.startsWith('/@'));
    const classifys = config.menus.filter((m) => m.type === 'classify');
    const classifyMap = {};
    classifys.forEach((classify) => {
      const classifyName = classify.classify.name;
      classifyMap[classifyName] = {};
      posts.forEach((post) => {
        const classifyValue = post.frontmatter[classifyName];
        if (!classifyValue) return;
        const classifyValues = classify.classify.multiple ? classifyValue.split(' ') : [classifyValue];
        classifyValues.forEach((v) => {
          if (!classifyMap[classifyName][v]) {
            classifyMap[classifyName][v] = 0;
          }
          classifyMap[classifyName][v]++;
        });
      });
    });
    return classifyMap;
  },
});
