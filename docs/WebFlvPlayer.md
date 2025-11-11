---
id: 1762753462754 # 文章id
date: 2025/11/10 13:44 # 时间
title: web 播放 .flv 视频 # 文章标题
description: web 播放 .flv 视频 # 文章描述
tag: 前端 # 文章标签
archive: # 文章归档
# recommendations: { recommendations } # 相关推荐id
shadow: false # 是否隐藏
top: 0 # 是否zhi置顶，数字越大优先级越高
---

# web 播放 flv 视频

## flv 是什么

FLV（Flash Video）是一种基于 Flash 技术的视频容器格式，曾是 Web 端视频分发的主流选择。2020 年 Adobe 停止支持 Flash 插件，现代浏览器（Chrome、Firefox 等）陆续移除 Flash 支持，FLV 失去原生播放基础。

**FLV 格式的核心特性**

1. 体积小巧：采用高效压缩算法，相同画质下文件体积比 MP4 小 30% 左右，加载速度更快。
2. 编码支持：主要支持 H.264 视频编码和 AAC 音频编码，兼容性强，适配多数播放器。
3. 流式传输：支持边下载边播放，无需等待完整文件加载，适合直播、短视频等即时播放场景。
4. 轻量化结构：文件头部信息简洁，解析速度快，对服务器带宽和客户端性能要求较低。

## 使用 flv.js 播放

[flv.js](https://www.npmjs.com/package/flv.js) 是一个纯 JavaScript 编写的 HTML5 Flash 视频(FLV)播放器，没有 Flash。

### 引入

```shell title=npm
npm install --save flv.js
```

```html title=CDN
<script src="https://cdn.jsdelivr.net/npm/flv.js@1.6.2/dist/flv.min.js"></script>
```

### 基础使用

```js
const player = flvjs.createPlayer({
  type: 'flv',
  url: 'https://example.com/video.flv', // FLV 视频地址（支持本地或远程）
});
player.attachMediaElement(document.getElementById('flv-player'));
player.load();

// 播放
player.play();
```

### 封装 vue 组件

```vue
<template>
  <video class="flvPlayer" ref="videoRef" controls :autoplay="autoplay" :muted="muted"></video>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import flvjs from 'flv.js';

// 组件参数
const props = defineProps({
  url: { type: String, default: 'https://example.com/stream.flv' },
  autoplay: { type: Boolean, default: false },
  muted: { type: Boolean, default: true },
  isLive: { type: Boolean, default: true },
});

// 内部状态
const videoRef = ref(null);
const flvPlayer = ref(null);

// 初始化播放器
const initPlayer = (url) => {
  if (!flvjs.isSupported() || !videoRef.value) return;

  // 销毁旧实例
  if (flvPlayer.value) {
    flvPlayer.value.destroy();
  }

  // 创建新实例
  flvPlayer.value = flvjs.createPlayer({
    type: 'flv',
    url,
  });

  flvPlayer.value.attachMediaElement(videoRef.value);

  // 加载并播放
  flvPlayer.value.load();
  flvPlayer.value.play();

  // 监听错误
  flvPlayer.value.on(flvjs.Events.ERROR, handleError);
};

// 错误处理
const handleError = (errType, errDetail) => {
  console.error('播放错误:', errType, errDetail);
  if (errDetail === flvjs.ErrorTypes.NETWORK_ERROR) {
    setTimeout(() => flvPlayer.value.reload(), 3000); // 网络错误自动重试
  }
};

// 生命周期管理
onMounted(() => {
  if (props.url) initPlayer(props.url);
});

onUnmounted(() => {
  if (flvPlayer.value) {
    flvPlayer.value.off(flvjs.Events.ERROR, handleError);
    flvPlayer.value.destroy(); // 组件销毁时清理资源
  }
});

// 监听URL变化，自动切换视频源
watch(
  () => props.url,
  (newUrl) => {
    if (newUrl) initPlayer(newUrl);
  }
);
</script>

<style scoped>
.flvPlayer {
  width: 1000px;
  margin: 20px auto;
}
</style>
```

## 参考

[flv.js - npm](https://www.npmjs.com/package/flv.js)
