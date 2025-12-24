<template>
  <div class="PageOuter">
    <div class="copyright">cosy247</div>
  </div>
  <Menu />
  <div class="pageBottom" ref="pageBottom">
    <div class="pageBottom-links">
      <a v-for="item in config.links" class="pageBottom-link" :href="item.url" target="_blank">
        <Icon :icon="item" />
        {{ item.name }}
      </a>
    </div>
    <div class="pageBottom-copyright">© 2024 cosy247</div>
  </div>
</template>

<script setup>
import Menu from './Menu.vue';
import config from '../../config';
import Icon from './Icon.vue';
import { onMounted, ref } from 'vue';
import { bottomHeight } from '../data';

const pageBottom = ref(null);
onMounted(() => {
  bottomHeight.value = pageBottom.value.clientHeight;
});
</script>

<style>
body {
  overflow-y: scroll;
  padding: calc(var(--outer-width)) 0 0 var(--outer-width);
  box-sizing: border-box;
}
@media (max-width: 810px) {
  body {
    padding: 0;
  }
}

body::-webkit-scrollbar {
  width: var(--outer-width);
  background: #1a232c;
  padding: 0px 0;
  margin: 0px 0;
}
</style>

<style scoped>
.PageOuter {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 600;
  border: var(--outer-width) solid #1a232c;
  box-sizing: border-box;
  pointer-events: none;
}

.PageOuter::before {
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

::v-deep(.PageOuter *) {
  pointer-events: auto;
}

.copyright {
  position: absolute;
  top: 100%;
  left: 50%;
  background: #125fd388;
  border-radius: var(--outer-width);
  transform: translateX(-50%);
  font-size: var(--outer-width);
  line-height: var(--outer-width);
  padding: 0px 10px;
  color: rgba(214, 214, 214, 0.833);
}
.pageBottom {
  position: fixed;
  bottom: 0;
  left: var(--outer-width);
  width: calc(100% - var(--outer-width));
  padding: 50px 0;
  background: #1a232c;
  z-index: -1;
  text-align: center;
  color: #888;
  font-size: 14px;
}
@media (max-width: 810px) {
  .pageBottom {
    left: 0;
    width: 100%;
  }
}
.pageBottom::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 40px;
  width: 150px;
  background: linear-gradient(#1a232c00, #164386);
  clip-path: polygon(0 0, 100% 0, 56% 100%, 44% 100%);
}
.pageBottom-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1vw;
}
.pageBottom-link:hover {
  color: #ccc;
}
.pageBottom-copyright {
  margin-top: 10px;
}
</style>
