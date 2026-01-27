---
id: 1769484738792 # 文章id
date: 2026/1/27 11:32 # 时间
title: Vue3 Keep-Alive 组件生命周期的“暂停键” # 文章标题
description: Vue3 Keep-Alive 组件生命周期的“暂停键” # 文章描述
tag: Vue 前端 # 文章标签
archive: # 文章归档
# recommendations: { recommendations } # 相关推荐id
shadow: false # 是否隐藏
top: 0 # 是否zhi置顶，数字越大优先级越高
---

# Vue3 Keep-Alive 组件生命周期的“暂停键”

在 Vue 应用的动态世界里，组件如同舞台上的演员，不断登场退场。但有些重要的“演员”每次重新登场都要从头准备，这无疑降低了整体性能。Vue 3 的 `keep-alive` 就像是给这些组件一个后台休息室，让它们不必每次都重新诞生并保存之前的状态。

## 什么是 Keep-Alive

`keep-alive` 是 Vue 3 的内置组件，它的核心功能是**缓存不活动的组件实例，而不是销毁它们**。当组件被切换出去时，它会被缓存起来，保留当前的状态；当再次需要时，直接从缓存中取出，避免重新渲染。

## 基本使用

```vue
<template>
  <keep-alive>
    <component :is="currentComponent"></component>
  </keep-alive>
</template>
```

这样简单的包装，就能让 `currentComponent` 切换时，之前的组件实例被保留在内存中。

## 生命周期的变化

被 `keep-alive` 包裹的组件会获得两个独特的生命周期钩子：

- `onActivated`：组件从缓存中重新激活时调用
- `onDeactivated`：组件被缓存时调用

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue';

onActivated(() => {
  console.log('组件被激活了！可以重新获取数据');
  // 恢复定时器、重新连接 WebSocket 等
});

onDeactivated(() => {
  console.log('组件被缓存了！');
  // 清除定时器、保存滚动位置等
});
</script>
```

## 组件筛选控制

`keep-alive` 默认会缓存内部的所有组件实例，但是可以通过 `include` 和 `exclude` 进行控制。

```vue
<template>
  <!-- 以英文逗号分隔的字符串 -->
  <KeepAlive include="a,b">
    <component :is="view" />
  </KeepAlive>

  <!-- 正则表达式 (需使用 `v-bind`) -->
  <KeepAlive :exclude="/a|b/">
    <component :is="view" />
  </KeepAlive>

  <!-- 数组 (需使用 `v-bind`) -->
  <KeepAlive :include="['a', 'b']">
    <component :is="view" />
  </KeepAlive>
</template>
```

- `include`：只有名称匹配的组件会被缓存（支持字符串、正则、数组）
- `exclude`：名称匹配的组件不会被缓存
- `max`：最多缓存多少个组件实例（LRU 策略）

> > 如果缓存的实例数量即将超过指定的那个最大数量，则最久没有被访问的缓存实例将被销毁，以便为新的实例腾出空间。

## 与 Vue Router 结合

```vue
<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="$route.fullPath" />
    </keep-alive>
  </router-view>
</template>
```

这样的配置可以保持页面状态，用户在表单填写后跳转返回时，数据依然存在。

## 参考

1. [KeepAlive | Vue.js](https://cn.vuejs.org/guide/built-ins/keep-alive)
