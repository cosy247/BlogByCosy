import { createContentLoader } from 'vitepress';
import config from '../../config';

export default createContentLoader(`../${config.srcDir}/**.md`, {
  includeSrc: false,
  excerpt: false,
  async transform(data) {
    const posts = data.filter((d) => d.frontmatter.id && !d.url.startsWith('/@'));
    const classifys = config.menus.filter((m) => m.type === 'classify' && m.classify.multiple);
    posts.forEach((post) => {
      classifys.forEach((classify) => {
        const classifyName = classify.classify.name;
        if (!post.frontmatter[classifyName]) return;
        post.frontmatter[classifyName] = post.frontmatter[classifyName].split(' ');
      });
    });
    posts.sort((p1, p2) => new Date(p2.frontmatter.date) - new Date(p1.frontmatter.date));
    return posts;
  },
});
