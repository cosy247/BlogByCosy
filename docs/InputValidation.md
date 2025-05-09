---
id: 1744076519411 # 文章id
date: 2025/04/16 16:04
title: Js 控制 Input 只可以输入数字、字母或正则匹配 # 文章标题
description: Js 控制 Input 只可以输入数字、字母或正则匹配 # 文章描述
tag: JS,Vue # 文章标签
archive: # 文章归档
recommendations: # 相关推荐id
shadow: false # 是否隐藏
top: 0 # 是否zhi置顶，数字越大优先级越高
---

# Js 控制 Input 只可以输入数字、字母或正则匹配

## 基础思路

通过监听用户的输入，在输入时判断新值是否满足校验条件，如果满足则不进行操作，如果不满足则保持原值（需要保存原值）。另外在给输入框赋值时会将光标移动到最后，需要监听输入光标变化，在输入不满足条件保持原值时同时也要将光标移动到之前输入位置。

## Js 实现

只可以输入数字：

```html
<input type="text" />
<script>
  const inputDom = document.querySelector('input');
  const verifyRag = /^[0-9]*$/;

  // 输入时校验
  inputDom.addEventListener('input', () => {
    if (!verifyRag.test(inputDom.value)) {
      inputDom.value = inputDom.lastValue || '';
      // 设置光标位置
      inputDom.setSelectionRange(inputDom.lastIndex, inputDom.lastIndex);
    } else {
      inputDom.lastValue = inputDom.value;
    }
  });

  // 光标改变时记录光标位置。
  inputDom.addEventListener('selectionchange', () => {
    inputDom.lastIndex = inputDom.selectionStart;
  });
</script>
```

> 通过修改 `verifyRag` 来改变输入控制。

简单封装下：

```html
<input type="text" />
<input type="text" />

<script>
  function verify(selector, rag) {
    // 不为正则表达式直接退出
    if (!(rag instanceof RegExp)) return;

    // 对查找到的节点进行控制
    const els = document.querySelectorAll(selector);
    for (const el of els) {
      // 只对input进行控制
      if (!(el instanceof HTMLInputElement)) continue;
      el.addEventListener('input', () => {
        if (!rag.test(el.value)) {
          el.value = el.lastValue || '';
          el.setSelectionRange(el.lastIndex, el.lastIndex);
        } else {
          el.lastValue = el.value;
        }
      });
      el.addEventListener('selectionchange', () => {
        el.lastIndex = el.selectionStart;
      });
    }
  }

  verify('input', /^[0-9]*$/);
</script>
```

## 封装为 Vue 指令

在 app 中注册指令：

```js
app.directive('verify', {
  mounted(el, binding) {
    if (!(el instanceof HTMLInputElement)) return;

    // 初始化正则表达式
    const predefinedPatterns = {
      number: /^[0-9]*$/, // 数字
      letter: /^[a-zA-Z]*$/, // 字母
      alphanumeric: /^[a-zA-Z0-9]*$/, // 字母和数字
    };

    // 检查是否使用了预定义的模式
    if (binding.arg && predefinedPatterns[binding.arg]) {
      el.initRag = predefinedPatterns[binding.arg];
    } else if (binding.value instanceof RegExp) {
      el.verifyRag = binding.value; // 直接存储正则表达式实例
    } else {
      return console.warn('v-verify value must be a RegExp or a predefined pattern (number, letter, alphanumeric)');
    }

    // 初始化 lastValue 和 lastIndex
    el.lastValue = '';
    el.lastIndex = 0;

    // 监听 input 事件
    el.addEventListener('input', () => {
      const currentValue = el.value;
      const verifyRag = el.initRag || el.verifyRag;
      if (!verifyRag.test(currentValue)) {
        // 使用存储的正则表达式实例
        el.value = el.lastValue; // 恢复上一次有效的值
        el.setSelectionRange(el.lastIndex, el.lastIndex);
      } else {
        el.lastValue = currentValue; // 更新 lastValue
      }
    });

    // 监听 selectionchange 事件来更新 lastIndex
    el.addEventListener('selectionchange', () => {
      el.lastIndex = el.selectionStart;
    });
  },
  updated(el, binding) {
    if (!(el instanceof HTMLInputElement) || el.initRag) return;

    // 更新正则表达式
    if (binding.value instanceof RegExp) {
      el.verifyRag = binding.value; // 更新存储的正则表达式实例
    } else {
      console.warn('v-verify value must be a RegExp');
    }
  },
});
```

使用：

```html
<template>
  <input v-verify:number v-model="number" placeholder="number" />
  <input v-verify:letter v-model="letter" placeholder="letter" />
  <input v-verify:alphanumeric v-model="alphanumeric" placeholder="alphanumeric" />
</template>

<script setup>
  import { ref } from 'vue';

  const number = ref('');
  const letter = ref('');
  const alphanumeric = ref('');
</script>
```

## 参考
