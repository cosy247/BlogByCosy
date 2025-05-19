<template>
  <div class="Dome">
    <div class="view" ref="viewDom"></div>
    <div class="tools">
      <div class="title">{{ props.title }}</div>
      <div class="info">{{ props.info }}</div>
      <div class="tool" @click="switchCode">
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
          <path
            d="M286.1056 204.8L0 526.67733333l286.1056 321.87733334 76.56106667-68.02773334-225.65546667-253.8496 225.65546667-253.8496zM725.06026667 204.8L648.53333333 272.82773333l225.65546667 253.8496L648.53333333 780.52693333l76.52693334 68.02773334 286.13973333-321.87733334z"
            fill="#999"></path>
        </svg>
      </div>
      <div class="tool" @click="copyCode">
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
          <path
            d="M843.40179753 180.59820247c0-91.39440197-74.3064968-165.70089876-165.70089877-165.70089877H180.59820247c-91.39440197 0-165.70089876 74.3064968-165.70089877 165.70089877v497.10269629c0 91.39440197 74.3064968 165.70089876 165.70089877 165.70089877 0 91.39440197 74.3064968 165.70089876 165.70089877 165.70089877h497.10269629c91.39440197 0 165.70089876-74.3064968 165.70089877-165.70089877V346.29910124c0-91.39440197-74.3064968-165.70089876-165.70089877-165.70089877zM125.32141827 677.70089876V180.59820247c0-30.42164939 24.72568098-55.27678419 55.2767842-55.2767842h497.10269629c30.42164939 0 55.27678419 24.72568098 55.27678421 55.2767842v497.10269629c0 30.42164939-24.72568098 55.27678419-55.27678421 55.27678421H180.59820247c-30.42164939 0-55.27678419-24.85513482-55.2767842-55.27678421z m773.35716346 165.70089877c0 30.42164939-24.72568098 55.27678419-55.2767842 55.2767842H346.29910124c-30.42164939 0-55.27678419-24.72568098-55.27678421-55.2767842H677.70089876c91.39440197 0 165.70089876-74.3064968 165.70089877-165.70089877V291.02231703c30.42164939 0 55.27678419 24.72568098 55.2767842 55.27678421v497.10269629z"
            fill="#999"></path>
        </svg>
      </div>
    </div>
    <div :style="{ height: codeHeight }" class="code">
      <div class="code-content" ref="codeContent">
        <div v-html="renderHightlightCode(props.data.trim(), 'html')"></div>
        <div class="code-bottom" @click="switchCode">收起</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue';
import { renderHightlightCode } from '../../src/utils/renderMark';

const props = defineProps(['title', 'info', 'data']);

/******** 代码加入影子节点运行 ********/
const viewDom = ref(null);
onMounted(() => {
  nextTick(() => {
    const root = viewDom.value.attachShadow({ mode: 'open' });
    root.innerHTML = props.data;
  });
});

/******** 显示或隐藏代码部分 ********/
const codeContent = ref(null);
let codeHeightMax = '0px';
const codeHeight = ref('0px');
onMounted(() => {
  codeHeightMax = getComputedStyle(codeContent.value).height;
});
function switchCode() {
  codeHeight.value = codeHeight.value === '0px' ? codeHeightMax : '0px';
}
</script>

<style scoped>
.Dome {
  border-radius: 10px;
  border: 1px solid #ddd8;
  overflow: hidden;
}
.view {
  padding: 20px;
}
.tools {
  display: flex;
  justify-content: flex-end;
  padding: 10px 20px;
  border-top: 1px solid #ddd8;
  gap: 15px;
}
.title {
  color: #666;
}
.info {
  font-size: 0.9em;
  line-height: 1.8em;
  color: #888;
  margin-right: auto;
  vertical-align: baseline;
}
.tool {
  padding: 3px;
  border: 1px solid #ddd;
  border-radius: 3px;
  cursor: pointer;
}
.tool:hover {
  background: #f2f2f2;
}
.code {
  overflow: hidden;
  transition: height 0.3s;
}
.code-content {
  border-top: 1px solid #ddd8;
  font-size: 15px;
}
.code-bottom {
  padding: 8px 20px;
  cursor: pointer;
  text-align: center;
  color: #666;
  background: #f2f2f2;
  font-size: 14px;
}
.code:deep(.shiki.one-dark-pro) {
  padding: 10px 20px;
  /* background: #fafafa !important; */
}
</style>
