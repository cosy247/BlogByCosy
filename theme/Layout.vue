<template>
  <div class="PageOuter" ref="scrollTargetRef">
    <Menu />
    <div class="page-main" :style="{ marginBottom: bottomHeight + 'px' }">
      <asyncComponent v-if="asyncComponent" />
      <div class="pageBottom-raduis"></div>
    </div>
    <Bottom />
  </div>
  <div class="PageRadius"></div>
  <div class="copyright">cosy247</div>
</template>

<script setup>
import './assets/styles/common.css';
import { useRoute } from 'vitepress';
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';
import config from '../config';
import { bottomHeight, scrollTarget } from './data';
import Menu from './components/Menu.vue';
import Bottom from './components/Bottom.vue';

const route = useRoute();
const scrollTargetRef = ref(null);
onMounted(() => {
  scrollTarget.value = scrollTargetRef.value;
});

const asyncComponent = computed(() => {
  if (!route.component) {
    return defineAsyncComponent({ loader: () => import('./views/NotFound.vue') });
  } else if (route.path === config.base) {
    return defineAsyncComponent({ loader: () => import('./views/Home.vue') });
  } else if (route.path.toLocaleLowerCase().includes('/readme.html')) {
    return defineAsyncComponent({ loader: () => import('./components/MdView.vue') });
  } else {
    return defineAsyncComponent({ loader: () => import('./views/Blog.vue') });
  }
});
</script>

<style scoped>
.PageOuter {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  border: var(--outer-width) solid #1a232c;
  border-right: none;
  padding-right: var(--outer-width) solid #1a232c;
  box-sizing: border-box;
  pointer-events: none;
}
.PageOuter > * {
  pointer-events: auto;
}
.PageOuter::-webkit-scrollbar {
  width: var(--outer-width);
  background: #1a232c;
  padding: 0px 0;
  margin: 0px 0;
}
@media (max-width: 1100px) {
  .PageOuter {
    border: none;
  }
  .PageOuter::-webkit-scrollbar {
    width: 0;
  }
}

.PageRadius {
  display: block;
  position: absolute;
  left: var(--outer-width);
  top: var(--outer-width);
  width: calc(100% - calc(var(--outer-width) * 2));
  height: calc(100% - calc(var(--outer-width) * 2));
  outline: var(--outer-width) solid #1a232c;
  z-index: 600;
  pointer-events: none;
  border-radius: var(--outer-width);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}
@media (max-width: 1100px) {
  .PageRadius {
    display: none;
  }
}

.page-main {
  background: white;
}

.pageBottom-raduis {
  position: relative;
  top: var(--outer-width);
  width: 100%;
  outline: var(--outer-width) solid #1a232c;
  border-radius: var(--outer-width);
  height: 40px;
  background: white;
  clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
}
@media (max-width: 1100px) {
  .pageBottom-raduis {
    display: none;
  }
}

.copyright {
  position: fixed;
  bottom: 0;
  left: 50%;
  background: #125fd388;
  border-radius: var(--outer-width);
  transform: translateX(-50%);
  font-size: var(--outer-width);
  line-height: var(--outer-width);
  padding: 0px 10px;
  color: rgba(214, 214, 214, 0.833);
  z-index: 999;
}
@media (max-width: 1100px) {
  .copyright {
    display: none;
  }
}
</style>
