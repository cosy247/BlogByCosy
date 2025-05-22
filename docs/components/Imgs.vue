<template>
  <div class="imgs-main">
    <img class="imgs-item" v-for="img in imgs" :src="img" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['imgs']);
</script>
<style scoped>
.imgs-title {
  text-align: center;
  font-size: var(--size4);
  font-weight: 900;
}
.imgs-main {
  column-count: 2;
  column-gap: 10px;
}
.imgs-item {
  display: block;
  border-radius: 5px;
  box-hidden: 0 0 10px #8888;
  width: 100%;
  margin-bottom: 10px;
}
</style>
