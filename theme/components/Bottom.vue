<template>
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
import config from '../../config';
import Icon from './Icon.vue';
import { onMounted, ref } from 'vue';
import { bottomHeight } from '../data';

const pageBottom = ref(null);
onMounted(() => {
  bottomHeight.value = pageBottom.value.clientHeight;
});
</script>

<style scoped>
.pageBottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 50px 0;
  background: #1a232c;
  z-index: -1;
  text-align: center;
  color: #888;
  font-size: 14px;
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
@media (max-width: 1100px) {
  .pageBottom::after {
    display: none;
  }
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
