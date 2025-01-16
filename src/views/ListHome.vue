<template>
  <div class="cover">
    <div class="cover-content" :style="{ paddingTop: 37 * firstPageProportion + '%' }">
      <p class="cover-title" v-if="isStaticPage">
        {{ route.params.name }}
        <span class="cover-title-value">.{{ route.params.value }}</span>
        <span class="cover-count">【{{ allPageList.length }}】</span>
      </p>
      <template v-else>
      <div class="cover-title">
        <div class="cover-logo" v-html="config.title"></div>
        <span class="cover-count">【{{ allPageList.length }}】</span>
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
  <div class="list">
    <a :href="`/docs/${item.file}`" class="list-item" v-for="item in currentPageList">
      <p class="list-item-title">{{ item.attrs.title }}</p>
      <div class="list-item-infos">
        <p class="list-item-info">
          &#xe6ad;
          {{ new Date(item.date).toLocaleDateString() }}
        </p>
      </div>
    </a>
    <div class="list-over">🐲 时间线到头了 🦄</div>
  </div>
</template>

<script setup>
import { pageList, statistics } from '../../temp/docsData.json';
import Icon from '../components/Icon.vue';
import { ref, computed, nextTick } from 'vue';
import config from '../../config';
import { RouterLink, useRoute } from 'vue-router';
import { watch } from 'vue';

// 过滤文章列表
const allPageList = ref([]);
const route = useRoute();
const isStaticPage = ref(false);
watch(
  () => [route.params.name, route.params.value],
  ([name, value]) => {
    
    isStaticPage.value = name && value;
    if (isStaticPage.value && statistics[name]) {
      allPageList.value = pageList.filter((page) => {
        if (Array.isArray(page.attrs[name])) {
          return page.attrs[name].some((val) => {
            return val.toLowerCase() === value.toLowerCase();
          });
        } else {
          return page.attrs[name]?.toLowerCase() === value.toLowerCase();
        }
      });
    } else {
      allPageList.value = pageList;
    }
  },
  { immediate: true }
);

// 座右铭
const mottos = config.mottos[(Math.random() * config.mottos.length) >> 0];

// 首屏滚动百分比
const firstPageProportion = ref(0);
window.addEventListener('scroll', () => {
  const { clientHeight, scrollTop } = document.documentElement;
  if (scrollTop < clientHeight) {
    firstPageProportion.value = scrollTop / clientHeight;
  }
});

// 当前需要显示的文章列表
const pageSize = 10;
const pageIndex = ref(1);
const isAddingPageList = ref(false);
const currentPageList = computed(() => allPageList.value.slice(0, pageSize * pageIndex.value));
window.addEventListener('scroll', () => {
  const { clientHeight, scrollTop, scrollHeight } = document.documentElement;
  if (isAddingPageList.value || currentPageList.length === allPageList.value.length) return;
  if (scrollHeight - clientHeight - scrollTop > 400) return;
  isAddingPageList.value = true;
  nextTick(() => (isAddingPageList.value = false));
  pageIndex.value++;
});

// const pageFilterType = computed(() => {
//   return pageConfig.countMateNames.find((name) => route.query[name]) || '';
// });

// const pageFilterValue = computed(() => {
//   return route.query[pageFilterType.value] || '';
// });

// watch(() => [pageFilterType, pageFilterValue], initPageList);

// function initPageList() {
//   if (pageFilterType.value) {
//     if (pageConfig.isArrMateNames.includes(pageFilterType.value)) {
//       remainPageList.value = pageDatas.filter((item) => {
//         return item.frontmatter[pageFilterType.value].includes(pageFilterValue.value);
//       });
//     } else {
//       remainPageList.value = pageDatas.filter((item) => {
//         return item.frontmatter[pageFilterType.value] == pageFilterValue.value;
//       });
//     }
//   } else {
//     remainPageList.value = pageDatas;
//   }
//   allPageCount.value = pageList.value.length + remainPageList.value.length;
//   pageList.value = remainPageList.value.splice(0, pageSize.value);
// }
// initPageList();
</script>

<style scoped>
.cover {
  position: relative;
  width: 100%;
  height: calc(50vh - 60px - var(--outer-width));
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover:has(.cover-logo) {
  height: calc(100vh - 60px - var(--outer-width));
}

.cover-content {
  box-sizing: border-box;
  padding-bottom: 10vh;
  max-width: 67%;
}

.cover.filter .cover-content {
  padding-bottom: 5vh;
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
  margin: 100px auto 300px;
  text-align: center;
  height: 2px;
  line-height: 2px;
  font-size: var(--size1);
  color: #1b283288;
}
</style>
