<template>
  <p class="imgs-title" v-if="title">{{ title }} - {{ imgs.length }}</p>
  <div class="imgs-main">
    <img class="imgs-item" v-for="img in imgs" :src="img" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['title', 'data']);
const title = props.title;
const imgs = ref(props.data.split('\n').filter((item) => item.trim()));
</script>
<style scoped>
.imgs-title {
  text-align: center;
  font-size: var(--size4);
  font-weight: 900;
}
.imgs-main {
  column-count: 3;
  column-gap: 10px;
}
.imgs-item {
  display: block;
  border-radius: 5px;
  box-shadow: 0 0 10px #8888;
  width: 100%;
  margin-bottom: 10px;
}
</style>
