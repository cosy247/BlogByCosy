<template>
  <PageOuter />
  <div class="blog-infos">
    <a :href="`${config.base}?${item.name}=${item.value}`" class="blog-info" v-for="item in classifys">
      <span class="blog-info-text">{{ item.value }}</span>
      <Icon class="blog-info-icon" :icon="classifyIconMap[item.name]" />
    </a>
    <div v-if="classifys.length" class="blog-info-br"></div>
    <div class="blog-info" @click="gotoRecom" v-if="pageInfo.recommendations.length">
      <span class="blog-info-text">相关推荐</span>
      <span class="blog-info-icon">&#xe60d;</span>
    </div>
    <!-- <div class="blog-info" @click="gotoComment">
      <span class="blog-info-text">评论</span>
      <span class="blog-info-icon">&#xe6b3;</span>
    </div> -->
    <div class="blog-info" @click="gotoTop">
      <span class="blog-info-text">顶部</span>
      <span class="blog-info-icon">&#xe62b;</span>
    </div>
  </div>
  <div class="blog-toc">
    <div
      class="blog-toc-item"
      v-for="item in toc"
      :class="`blog-toc-depth${item.depth} ${item.id === currentTocId ? 'blog-toc-active' : ''}`"
      @click="goToDepth(item.el)">
      <p>{{ item.name }}</p>
    </div>
  </div>
  <!-- <div ref="mdView"> -->
  <MdView class="blog-mdView" />
  <!-- </div> -->
  <template v-if="pageInfo.recommendations.length">
    <p class="recom-title" ref="recom">✨相关推荐✨</p>
    <div class="recoms">
      <a :href="item.url" class="recom" v-for="item in pageInfo.recommendations">✨ {{ item.title }}</a>
    </div>
  </template>
  <div class="footer-space"></div>
</template>

<script setup>
import MdView from '../components/MdView.vue';
import Icon from '../components/Icon.vue';
import { computed, onMounted, ref } from 'vue';
// import config from '../../config';
// import { useRoute } from 'vue-router';
// import { pageList } from '../../temp/docsData.json';
// import { getPageMateById } from '../utils/getPage';
// import Giscus from '@giscus/vue';
// import { markTocMap } from '../utils/renderMark';
// import { data as postsData } from '../data/posts.data';
import { useData, useRoute } from 'vitepress';
import { postsData } from '../data';
import { classifyNames, multipleClassifyNames } from '../data/classifyNames';
import config from '../../config';
import PageOuter from '../components/PageOuter.vue';

const route = useRoute();

// 当前文章信息
const pageInfo = computed(() => {
  return postsData.find((p) => p.frontmatter.id === route.data.frontmatter.id) || { frontmatter: {}, recommendations: [] };
});

// 当前分类
const classifys = computed(() => {
  const classify = [];
  classifyNames.forEach((name) => {
    if (!pageInfo.value.frontmatter[name]) return;
    if (multipleClassifyNames.includes(name)) {
      pageInfo.value.frontmatter[name].forEach((value) => {
        classify.push({ name, value });
      });
    } else {
      classify.push({ name, value: pageInfo.value.frontmatter[name] });
    }
  });
  return classify;
});

// 分类图标映射
const classifyIconMap = computed(() => {
  const map = {};
  config.menus.forEach((menu) => {
    if (menu.type !== 'classify') return;
    if (menu.classify?.name) {
      map[menu.classify.name] = menu;
    }
  });
  return map;
});

// 获取目录结构
const toc = ref([]);
onMounted(() => {
  document.querySelectorAll('.blog-mdView > div > h2, .blog-mdView > div > h3').forEach((item) => {
    toc.value.push({
      el: item,
      id: item.id,
      name: item.innerText,
      depth: item.tagName === 'H2' ? 2 : 3,
    });
  });
});

// 点击目录定位到目标标题
function goToDepth(target) {
  if (typeof window === 'undefined') return;
  let top = -400;
  while (target) {
    top += target.offsetTop;
    target = target.parentElement;
  }
  window.scrollTo({ top, behavior: 'smooth' });
}

// 目录当前显示节点
const currentTocId = ref(null);
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    const target = toc.value.find((m) => m.el.getBoundingClientRect().top > 50) || toc.value.at(-1);
    if (target) currentTocId.value = target.id;
  });
}

// 点击顶部按钮
function gotoTop() {
  if (typeof window === 'undefined') return;
  window.document.documentElement.scrollTop = 0;
}

const recom = ref(null);
function gotoRecom() {
  if (typeof window === 'undefined') return;
  window.document.documentElement.scrollTop = recom.value.offsetTop - 100;
}

// const comment = ref(null);
// function gotoComment() {
//   window.document.documentElement.scrollTop = comment.value.offsetTop - 100;
// }
</script>

<style scoped>
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
  margin: 150px auto 0;
  width: 95%;
  max-width: var(--blog-width);
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
  cursor: pointer;
}
.recom:hover {
  border: 1px solid #1979df;
  background: #1979df;
  color: white;
}
.blog-comment {
  position: relative;
  top: 200px;
  background: linear-gradient(#fff0, #fff 50px);
  z-index: 1;
  pointer-events: none;
  min-height: 80vh;
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
  width: calc(50% - 420px);
  max-width: calc(50% - 420px);
  max-height: 50%;
  overflow-y: auto;
  overflow-x: clip;
  transform: translate(0, -50%);
  font-size: var(--size1);
  transition: 0.5s;
  white-space: nowrap;
}
.blog-toc-item {
  display: none;
  line-height: 1.3em;
  cursor: pointer;
  color: transparent;
  width: 80%;
  transition: 0.3s;
}
.blog-toc-item > p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.blog-toc-item.blog-toc-active {
  color: #333;
  font-weight: 900;
}
.blog-toc-item.blog-toc-active::before {
  background: #0366d6;
}
.blog-toc:hover .blog-toc-item {
  color: #3338;
}
.blog-toc-item.blog-toc-item:hover {
  color: #333;
}
.blog-toc-item + .blog-toc-item {
  margin-top: 5px;
}
.blog-toc-item::before {
  content: '';
  width: 1em;
  height: 0.3em;
  background: #c2c3c188;
  display: inline-block;
  border-radius: 1em;
  flex-shrink: 0;
}
.blog-toc-depth2,
.blog-toc-depth3 {
  display: flex;
  align-items: center;
  gap: 5px;
}
.blog-toc-depth3::before {
  width: 1.5em;
}
.blog-toc::-webkit-scrollbar {
  background: #0000;
}
.blog-toc::-webkit-scrollbar-thumb {
  background: #0000;
}
.footer-space {
  height: 200px;
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
