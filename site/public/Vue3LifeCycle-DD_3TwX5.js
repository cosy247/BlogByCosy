const r=`---\r
id: 24091011454891\r
title: Vue3 生命周期\r
description: Vue3 生命周期\r
tags: Vue 前端\r
archive:\r
recommendations:\r
shadow: false\r
top: 0\r
---\r
\r
# vue3 生命周期\r
\r
在了解 vue3 生命周期前，建议先阅读[vue2 生命周期钩子](/Vue2LifeCycle.html)。\r
\r
## 生命周期一览\r
\r
[VUE3 官网生命周期参考](https://cn.vuejs.org/api/composition-api-lifecycle.html)\r
\r
| 生命周期        | 时机                                     | 说明                                 |\r
| --------------- | ---------------------------------------- | ------------------------------------ |\r
| setup           | 实例创建之前                             |                                      |\r
| beforeCreate    | 实例初始化完成之后                       |                                      |\r
| created         | 实例处理完所有与状态相关的选项后         |                                      |\r
| beforeMount     | 被挂载之前                               | 服务端渲染不可用                     |\r
| mounted         | 被挂载之后                               | 服务端渲染不可用                     |\r
| beforeUpdate    | 响应式状态变更而更新其 DOM 树之前        | 服务端渲染不可用                     |\r
| updated         | 响应式状态变更而更新其 DOM 树之后        | 服务端渲染不可用                     |\r
| beforeUnmount   | 被卸载之前                               | 服务端渲染不可用                     |\r
| unmounted       | 被卸载之后                               | 服务端渲染不可用                     |\r
| errorCaptured   | 捕获了后代组件传递的错误时               |                                      |\r
| renderTracked   | 在一个响应式依赖被组件的渲染作用追踪后   | 仅在开发模式下可用，服务端渲染不可用 |\r
| renderTriggered | 在一个响应式依赖被组件触发了重新渲染之后 | 仅在开发模式下可用，服务端渲染不可用 |\r
| activated       | KeepAlive 中，被插入到 DOM 中时          | 服务端渲染不可用                     |\r
| deactivated     | KeepAlive 中，从 DOM 中被移除时          | 服务端渲染不可用                     |\r
| serverPrefetch  | 在服务器上被渲染之前                     | 仅会在服务端渲染中执行               |\r
\r
**生命周期图示：**\r
\r
![alt text](assets/Vue3LifeCycle/image.png =600x)\r
\r
## setup\r
\r
[setup()](https://cn.vuejs.org/api/composition-api-setup.html) 钩子是在组件中使用组合式 API 的入口。\r
\r
\`\`\`vue\r
<template>\r
  <button @click="count++">{{ count }}</button>\r
</template>\r
\r
<script>\r
import { ref } from "vue";\r
\r
export default {\r
  setup() {\r
    const count = ref(0);\r
    return {\r
      count,\r
    };\r
  },\r
};\r
<\/script>\r
\`\`\`\r
\r
对于结合单文件组件使用的组合式 API，推荐通过 [\\<script setup\\>](https://cn.vuejs.org/api/sfc-script-setup.html) 以获得更加简洁及符合人体工程学的语法。\r
\r
\`\`\`vue\r
<template>\r
  <button @click="count++">{{ count }}</button>\r
</template>\r
\r
<script setup>\r
import { ref } from "vue";\r
\r
const count = ref(0);\r
<\/script>\r
\`\`\`\r
\r
## 使用生命周期钩子\r
\r
\`vue3\` 中可以使用 \`vue2\` 的对象属性方式来声明生命周期钩子，但是更加推荐在 \`setup\` 中完成相关生命周期钩子的注册：\r
\r
\`\`\`vue\r
<script>\r
// 引入生命周期钩子对应的函数名\r
import { onBeforeMount, onUpdated, onBeforeUnmount } from "vue";\r
\r
export default {\r
  setup() {\r
    onBeforeMount(() => {\r
      // ...\r
    });\r
    onUpdated(() => {\r
      // ...\r
    });\r
    onBeforeUnmount(() => {\r
      // ...\r
    });\r
  },\r
};\r
<\/script>\r
\`\`\`\r
\r
## 参考\r
\r
[生命周期选项](https://cn.vuejs.org/api/options-lifecycle.html)\r
`;export{r as default};
