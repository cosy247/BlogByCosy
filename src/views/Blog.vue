<template>
  <!-- <div class="archiveList" v-if="archiveList.length">
    <div class="archive-item" v-for="archive in archiveList">
      <p class="archive-item-title" v-if="archive.newTitle">{{ archive.archiveTitle }}</p>
      <a class="archive-item-name" :class="{ active: path === archive.path }" :href="archive.path">
        {{ archive.pageTitle }}
      </a>
    </div>
  </div> -->
  <!-- <div class="blog-infos" v-else>
    <a :href="item.url" class="blog-info" v-for="item in staticFrontmatter">
      <span class="blog-info-text">{{ item.value }}</span>
      <Icon class="blog-info-icon" :icon="staticFrontmatterIconMap[item.name]" />
    </a>
    <div v-if="staticFrontmatter.length" class="blog-info-br"></div>
    <div class="blog-info" @click="gotoRecom" v-if="recommendations.length">
      <span class="blog-info-text">相关推荐</span>
      <span class="blog-info-icon">&#xe60d;</span>
    </div>
    <div class="blog-info" @click="gotoComment">
      <span class="blog-info-text">评论</span>
      <span class="blog-info-icon">&#xe6b3;</span>
    </div>
    <div class="blog-info" @click="gotoTop">
      <span class="blog-info-text">顶部</span>
      <span class="blog-info-icon">&#xe62b;</span>
    </div>
  </div> -->
  <MdView class="blog-mdView" :fileName="docsFile"/>
  <!-- <div class="navigate">
    <a class="navigate-left" v-if="archiveNavigate.left" :href="archiveNavigate.left.path">
      {{ archiveNavigate.left.pageTitle }}
    </a>
    <div></div>
    <a class="navigate-right" v-if="archiveNavigate.right" :href="archiveNavigate.right.path">
      {{ archiveNavigate.right.pageTitle }}
    </a>
  </div> -->
  <!-- <template v-if="recommendations.length">
    <p class="recom-title">✨相关推荐✨</p>
    <div class="recoms" ref="recom" v-if="recommendations.length">
      <a :href="item.path" class="recom" v-for="(item, index) in recommendations" :key="index">
        ✨ {{ item.frontmatter.title }}
      </a>
    </div>
  </template> -->
  <!-- <template v-if="config.giscus.repo && config.giscus.repoId">
    <p class="recom-title">🧐评论🧐</p>
    <div class="blog-comment" ref="comment">
      <div class="blog-comment-main">
        <Giscus v-bind="config.giscus" />
      </div>
    </div>
  </template> -->
  <div class="bottom"></div>
  <!-- <div class="blog-toc">
    <Toc ref="toc" />
  </div> -->
</template>

<script setup>
// import { archiveMap, pageConfig, pageDatas } from '../utils/blogMate';
// import { usePageData, useRoute, useRouter } from '@vuepress/client';
import MdView from '../components/MdView.vue';
import Icon from '../components/Icon.vue';
// import Giscus from '@giscus/vue';
import { ref, computed } from 'vue';
import config from '../../config';
import { useRoute } from 'vue-router';

const route = useRoute();
const docsFile = computed(() => route.params.file)

// const archiveList = archiveMap[pageData.frontmatter.archive] || [];
// const comment = ref(null);
// const recom = ref(null);
// const router = useRouter();
// const path = decodeURI(useRoute().path.slice(1));
// const toc = ref(null);
// const giscusAttrs = pageConfig.giscus;

// const archiveNavigate = computed(() => {
//   const index = archiveList.findIndex((ar) => ar.path === path);
//   return {
//     left: index > 0 ? archiveList[index - 1] : null,
//     right: index < archiveList.length - 1 ? archiveList[index + 1] : null,
//   };
// });

// const staticFrontmatterIconMap = computed(() => {
//   return pageConfig.menus
//     .filter((item) => item.type === 'statistics')
//     .reduce((staticFrontmatterIconMap, item) => {
//       staticFrontmatterIconMap[item.statistics.frontName] = {
//         fontIcon: item.fontIcon,
//         imgIcon: item.imgIcon,
//       };
//       return staticFrontmatterIconMap;
//     }, {});
// });

const staticFrontmatter = computed(() => {
  return pageConfig.countMateNames.reduce((staticFrontmatter, name) => {
    if (!pageData.frontmatter[name]) return staticFrontmatter;
    if (pageConfig.isArrMateNames.includes(name)) {
      pageData.frontmatter[name].split(' ').forEach((n) => {
        staticFrontmatter.push({
          name: name,
          value: n,
          url: `/?${name}=${n}`,
        });
      });
    } else {
      staticFrontmatter.push({
        name: name,
        value: pageData.frontmatter[name],
        url: `/?${name}=${pageData.frontmatter[name]}`,
      });
    }
    return staticFrontmatter;
  }, []);
});

// const recommendations = computed(() => {
//   const recommendations = pageDatas.find((i) => i.frontmatter.id === pageData.frontmatter.id);
//   if (recommendations?.frontmatter?.recommendations?.length) {
//     return recommendations.frontmatter.recommendations
//       .map((id) => pageDatas.find((i) => i.frontmatter.id === +id))
//       .filter((i) => i);
//   }
//   return [];
// });

function gotoComment() {
  if (typeof window == 'undefined') return;
  window.document.documentElement.scrollTop = comment.value.offsetTop - 200;
}

function gotoTop() {
  if (typeof window == 'undefined') return;
  window.document.documentElement.scrollTop = 0;
}

function gotoRecom() {
  if (typeof window == 'undefined') return;
  window.document.documentElement.scrollTop = recom.value.offsetTop - 200;
}

// toc滚动跟随
window.addEventListener('scroll', () => {
  // if (currentHash.value === location.hash) return;
  // currentHash.value = location.hash;
  // const activeToc = toc.value.querySelector('.route-link.vuepress-toc-link.active');
  // if (!activeToc) return;
  // toc.value.scrollTop = activeToc.offsetTop - toc.value.clientHeight / 2;
});
</script>

<style scoped>
.archiveList {
  position: fixed;
  top: 50%;
  right: calc(50% + 420px);
  overflow: auto;
  transform: translate(0, -50%);
  height: 80%;
  margin-top: 5vh;
  border-right: 1px solid #ccc;
  padding: 10px 0;
  padding-right: 40px;
}
.archive-item + .archive-item {
  margin-top: 30px;
}
.archive-item-title {
  font-size: var(--size2);
  font-weight: 900;
  margin-bottom: 10px;
}
.archive-item-name {
  font-size: var(--size1);
  color: #444;
}
.archive-item-name:hover {
  font-size: var(--size1);
  color: var(--color-theme);
}
.archive-item-name.active {
  color: var(--color-theme);
}
.blog-infos {
  position: fixed;
  top: 50%;
  right: calc(50% + 420px);
  overflow: auto;
  transform: translate(0, -50%);
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  align-items: flex-end;
  transition: 0.5s;
  z-index: 10;
}
.blog-infos.hidden {
  opacity: 0;
  pointer-events: none;
}
.blog-infos:hover .blog-info-text {
  opacity: 0.3;
}
.blog-info {
  padding: 10px 0;
  cursor: pointer;
  white-space: nowrap;
}
.blog-info-br {
  font-size: var(--size2);
  height: 1px;
  width: 2em;
  background: var(--color-theme);
  opacity: 0.2;
  transition: 0.5s;
}
.blog-infos:hover .blog-info-br {
  width: 100%;
  opacity: 1;
}
.blog-info-text {
  font-size: var(--size1);
  margin-right: 10px;
  opacity: 0;
  font-weight: 900;
  transition: 0.5s;
}
.blog-info:hover > .blog-info-text {
  opacity: 1;
}
.blog-info-icon {
  display: inline-block;
  margin: auto;
  font-size: var(--size2);
  height: 2em;
  width: 2em;
  line-height: 2em;
  text-align: center;
  background: #f1f3f3;
  border-radius: 50%;
  cursor: pointer;
  transition: 0.3s;
  color: #999;
}
.blog-info:hover .blog-info-icon {
  color: #333;
}
.blog-tags {
  margin-top: 20px;
  flex-wrap: wrap;
}
.blog-tag {
  font-size: var(--size1);
  padding: 0.1em 0.7em;
  border-radius: 0.5em;
  border: 2px solid #333;
  margin-right: 0.5em;
  cursor: pointer;
}
.blog-mdView {
  margin: auto;
  width: 95%;
  max-width: var(--blog-width);
}
.navigate {
  margin: auto;
  width: 95%;
  max-width: var(--blog-width);
  display: flex;
  justify-content: space-between;
}
.navigate-left,
.navigate-right {
  width: 48%;
  padding: 15px;
  box-sizing: border-box;
  font-size: var(--size1);
  border: 1px solid #ddd;
  border-radius: 10px;
  color: var(--color-theme);
  margin-top: 50px;
  font-weight: 900;
  transition: 0.2s;
}
.navigate-left {
  text-align: left;
}
.navigate-right {
  text-align: right;
}
.navigate-left::before {
  content: '上一篇';
  color: #555;
  display: block;
  transform: scale(0.9);
  transform-origin: top left;
  font-weight: 500;
  margin-bottom: 2px;
}
.navigate-right::before {
  content: '下一篇';
  color: #555;
  display: block;
  text-align: right;
  transform: scale(0.9);
  transform-origin: top right;
  font-weight: 500;
  margin-bottom: 2px;
}
.navigate-left:hover,
.navigate-right:hover {
  border-color: var(--color-theme);
}
.recom-title {
  font-size: var(--size3);
  text-align: center;
  margin-top: 100px;
}
.recoms {
  display: flex;
  gap: 20px;
  width: 95%;
  max-width: var(--blog-width);
  margin: 30px auto 0;
  flex-wrap: wrap;
}
.recoms:empty {
  margin-top: 0;
}
.recom {
  border: 1px solid #1979df88;
  padding: 10px;
  border-radius: 10px;
  font-size: var(--size1);
  font-weight: 900;
}
.recom:hover {
  border: 1px solid #1979df;
  background: #1979df;
  color: white;
}
.bottom {
  height: 200px;
}
.blog-comment {
  position: relative;
  top: 200px;
  /* background: linear-gradient(#fff0, #fff 50px); */
  z-index: 1;
  pointer-events: none;
}
.blog-comment-main {
  position: relative;
  top: -150px;
  width: 95%;
  max-width: var(--blog-width);
  margin: auto;
  pointer-events: auto;
}
.blog-toc {
  position: fixed;
  top: 50%;
  padding-right: 10px;
  left: calc(50% + 420px);
  width: fit-content;
  max-width: calc(50% - 420px);
  max-height: 50%;
  overflow-y: auto;
  overflow-x: clip;
  transform: translate(0, -50%);
  font-size: var(--size1);
  transition: 0.5s;
  white-space: nowrap;
}

.blog-toc::-webkit-scrollbar {
  background: #0000;
}

.blog-toc::-webkit-scrollbar-thumb {
  background: #0000;
}
</style>

<style>
.blog-mdView div > h1:first-child {
  font-size: var(--size7);
  margin-bottom: 20px;
  word-break: break-all;
}
.blog-toc .vuepress-toc-item > a {
  opacity: 0.5;
  transition: 0.5s;
  color: transparent;
  display: block;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 0.1em 0;
  font-size: var(--size1);
}
.blog-toc:hover .vuepress-toc-item > a {
  color: inherit;
  opacity: 0.6;
}
.blog-toc .vuepress-toc-item > a:hover {
  opacity: 1;
}
.blog-toc .vuepress-toc-item > a.active {
  opacity: 1;
  color: inherit;
  font-weight: 900;
}
.blog-toc .vuepress-toc-item > a::before {
  content: '';
  width: 1em;
  height: 0.25em;
  background: #c1c2c4;
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.5em;
  border-radius: 1em;
}
.blog-toc .vuepress-toc-item > a:hover::before {
  opacity: 0.5;
  background: var(--color-theme);
}
.blog-toc .vuepress-toc-item > a.active::before {
  opacity: 1;
  background: var(--color-theme);
}
.blog-toc .vuepress-toc-list > .vuepress-toc-item > .vuepress-toc-list .vuepress-toc-item > a::before {
  width: 1.5em;
}
</style>
