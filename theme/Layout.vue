<template>
  <asyncComponent v-if="asyncComponent" />
</template>

<script setup>
import './assets/styles/common.css';
import { useRoute } from 'vitepress';
import { computed, defineAsyncComponent, onMounted } from 'vue';
import config from '../config';

const route = useRoute();

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
.Index {
  position: relative;
  height: 100vh;
  width: 100vw;
  border: var(--outer-width) solid #1a232c;
  box-sizing: border-box;
}

.Index::before {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  outline: var(--outer-width) solid #1a232c;
  z-index: 600;
  pointer-events: none;
  border-radius: var(--outer-width);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

.router {
  position: relative;
  width: 100%;
  min-height: 100%;
  z-index: 1;
  padding-bottom: 100px;
}

.notFound {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.notFound-icon {
  font-size: 40vmin;
}

.notFound-text {
  font-size: 10vmin;
}
</style>
·
