import { createContentLoader } from 'vitepress';
import config from '../../config';
import { multipleClassifyNames } from './classifyNames';

// 计算两个字符串的 Jaccard 相似度
function jaccardSimilarity(a, b) {
  const setA = new Set(a.split(''));
  const setB = new Set(b.split(''));
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

export default createContentLoader(`../${config.srcDir}/**.md`, {
  includeSrc: false,
  excerpt: false,
  async transform(data) {
    const posts = JSON.parse(JSON.stringify(data)).filter(
      (d) => d.frontmatter.id && !d.url.startsWith('/@') && d.frontmatter.hidden !== true
    );
    posts.forEach((post) => (post.url = `${config.base}${post.url.slice(1)}`));
    posts.forEach((post) => {
      // 处理文章的 classify
      multipleClassifyNames.forEach((classify) => {
        const classifyName = classify;
        if (!post.frontmatter[classifyName]) return;
        post.frontmatter[classifyName] = post.frontmatter[classifyName]?.split?.(' ');
      });
      // 获取相识文章
      const postsimilars = posts.reduce((acc, post0) => {
        if (post0.frontmatter.id === post.frontmatter.id) return acc;
        const similarity = jaccardSimilarity(post.frontmatter.title, post0.frontmatter.title);
        acc.push({ post: { url: post0.url, title: post0.frontmatter.title }, similarity });
        return acc;
      }, []);
      postsimilars.sort((a, b) => b.similarity - a.similarity);
      post.recommendations = postsimilars.slice(0, 5).map((item) => item.post);
    });
    posts.sort((p1, p2) => new Date(p2.frontmatter.date) - new Date(p1.frontmatter.date));
    return posts;
  },
});
