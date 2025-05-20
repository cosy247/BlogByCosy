<template>
  <PageOuter />
  <asyncComponent v-if="asyncComponent" />
</template>

<script setup>
import './assets/styles/common.css';
import PageOuter from './components/PageOuter.vue';
import { useRoute } from 'vitepress';
import { computed, defineAsyncComponent } from 'vue';

const route = useRoute();
const asyncComponent = computed(() => {
  let componentName = 'Blog';
  if (!route.component) {
    componentName = 'NotFound';
  } else if (route.path === '/') {
    componentName = 'Home';
  }
  return defineAsyncComponent({
    loader: () => import(`./views/${componentName}.vue`),
  });
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
