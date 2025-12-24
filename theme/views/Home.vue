<template>
  <PageOuter />
  <div class="cover" ref="coverDom">
    <div class="cover-content" :style="{ bottom: `calc(${50 - 50 * firstPageProportion}%)`, opacity: 1 - firstPageProportion }">
      <p class="cover-title" v-if="filter.type">
        {{ filter.type }}
        <span class="cover-title-value">.{{ filter.value }}</span>
        <span class="cover-count">【{{ postCount }}】</span>
      </p>
      <template v-else>
        <div class="cover-title">
          <div class="cover-logo" v-html="config.pageTitle"></div>
          <span class="cover-count">【{{ postCount }}】</span>
        </div>
        <p class="cover-dictum">{{ mottos[0] }}</p>
        <p class="cover-dictum-2" v-for="motto in mottos.slice(1)">{{ motto }}</p>
      </template>
      <div class="cover-links">
        <a v-for="item in config.links" class="cover-link" :href="item.url" target="_blank">
          <Icon :icon="item" />
          {{ item.name }}
        </a>
      </div>
    </div>
  </div>
  <div class="list" v-if="postsData">
    <template v-for="item in postsData" :key="item.frontmatter.id">
      <a :href="item.url" class="list-item" target="_self" v-show="!item.hidden">
        <p class="list-item-title">{{ item.frontmatter.title }}</p>
        <div class="list-item-infos">
          <p class="list-item-info">
            &#xe6ad;
            {{ item.frontmatter.date }}
          </p>
        </div>
      </a>
    </template>
    <div class="list-over">🐲 时间线到头了 🦄</div>
  </div>
</template>

<script setup>
import Icon from '../components/Icon.vue';
import { ref, computed } from 'vue';
import config from '../../config';
import { data as postsData } from '../data/posts.data';
import { multipleClassifyNames } from '../data/classifyNames';
import PageOuter from '../components/PageOuter.vue';

// 筛选
const filter = {};
if (typeof window !== 'undefined') {
  const params = new URL(window.location.href).searchParams;
  for (const classifyName of multipleClassifyNames) {
    if (params.get(classifyName)) {
      filter.type = classifyName;
      filter.value = params.get(classifyName);
      filter.multiple = multipleClassifyNames.includes(classifyName);
    }
  }
}

// 过滤
postsData.forEach((p) => {
  if (!filter.type) return;
  if (p.frontmatter[filter.type]) {
    if (filter.multiple) {
      p.hidden = !p.frontmatter[filter.type].includes(filter.value);
    } else {
      p.hidden = p.frontmatter[filter.type] !== filter.value;
    }
  } else {
    p.hidden = true;
  }
});

// 文章数量
const postCount = postsData.filter((p) => !p.hidden).length;

// 座右铭
const mottos = config.mottos[(Math.random() * config.mottos.length) >> 0];

// 首屏滚动百分比
const coverDom = ref(null);
const firstPageProportion = ref(0);
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    const coverHeight = coverDom.value.clientHeight;
    const { scrollTop } = document.documentElement;
    if (scrollTop < coverHeight) {
      firstPageProportion.value = scrollTop / coverHeight;
    }
  });
}
</script>

<style scoped>
.cover {
  position: relative;
  width: 100%;
  height: calc(50vh - var(--outer-width));
}

.cover:has(.cover-logo) {
  height: calc(100vh - var(--outer-width));
}

@media (max-width: 810px) {
  .cover {
    height: calc(50vh);
  }
  .cover:has(.cover-logo) {
    height: calc(100vh);
  }
}

.cover-content {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 37%);
  max-width: 67%;
}

.cover-title {
  font-size: 11vmin;
  display: flex;
  align-items: baseline;
  animation: outFromBottom 0.5s;
}

@keyframes outFromBottom {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
}

.cover-title-value {
  font-size: 0.4em;
}

.cover-count {
  font-size: var(--size2);
}

.cover-title img {
  height: 1em;
}

.cover-logo {
  display: flex;
  align-items: center;
}

.cover-dictum {
  font-size: var(--size2);
  margin-top: 25px;
  color: #334155;
}

.cover-dictum-2 {
  font-size: var(--size1);
  margin-top: 20px;
  color: #334155ca;
}

.cover-links {
  display: flex;
  align-items: center;
  margin-top: 40px;
  color: #5d67e8;
  font-size: var(--size1);
}

.cover-link {
  margin-right: 20px;
}

.cover-link::first-letter {
  margin-right: 5px;
}

.list {
  margin: auto;
  min-height: 50vh;
  width: var(--content-width);
  max-width: var(--content-max-width);
}

.list-item {
  display: block;
  transition: 0.2s;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.list-item:hover {
  opacity: 1;
}

.list-item + .list-item {
  margin-top: 50px;
}

.list-item-title {
  position: relative;
  color: #1b2832;
  font-size: var(--size5);
}

.list-item-title::after {
  content: '';
  width: 100%;
  height: 2px;
  position: absolute;
  left: 0;
  top: 100%;
  background: linear-gradient(to right, red, blue);
  opacity: 0;
  transition: 0.2s;
  margin-top: 5px;
}

.list-item:hover .list-item-title::after {
  opacity: 1;
}

.list-item-infos {
  margin-top: 15px;
  font-size: var(--size1);
  display: flex;
  align-items: center;
  justify-content: right;
}

.list-item-info {
  margin-left: 15px;
}

.list-over {
  padding: 100px 0px;
  text-align: center;
  height: 2px;
  line-height: 2px;
  font-size: var(--size1);
  color: #1b283288;
}
</style>
