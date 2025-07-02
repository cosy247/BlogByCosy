<template>
  <div class="Timer">
    <div class="circle" :style="{ background: props.color }">
      <div class="title">{{ props.title }}</div>
      <div class="count">{{ dayCount }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['time', 'title', 'color']);

const dayCount = Math.floor((Date.now() - new Date(props.time).valueOf()) / 1000 / 60 / 60 / 24);
</script>

<style scoped>
.Timer {
  display: inline-block;
  box-shadow: 0 0 8px #8884;
  width: 90px;
  height: 90px;
  margin: 8px;
  border-radius: 10px;
}
.circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 5px;
  text-align: center;
  line-height: 0;
  color: #333;
}
.title {
  font-size: 22px;
  padding-top: 28px;
}
.count {
  font-size: 20px;
  padding-top: 28px;
}
</style>
