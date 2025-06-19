---
id: 1750297606733
date: 2025-06-19 09:53
title: 多种方式创建 Vue 项目
tag: Vue 前端
archive:
recommendations:
description: 多种方式创建 Vue 项目
---

# 多种方式创建 Vue 项目

Vue.js 是目前最流行的前端框架之一，它以其简洁、灵活和高性能的特点，深受开发者喜爱。创建一个 Vue 项目是开始任何 Vue 应用开发的第一步。

## 使用 Vue CLI 创建项目

Vue CLI 是 Vue.js 官方提供的命令行工具，它可以帮助你快速搭建 Vue 项目，支持多种预设配置和插件。

#### 1. 安装 Vue CLI

如果你尚未安装 Vue CLI，可以通过以下命令全局安装：

```bash
npm install -g @vue/cli
```

#### 2. 创建项目

运行以下命令创建一个新的 Vue 项目：

```bash
vue create my-vue-project
```

CLI 会提示你选择一些配置选项，例如是否使用 Babel、TypeScript、Router 等。你可以根据需求选择默认配置或手动选择特性。

#### 3. 启动项目

进入项目目录并启动开发服务器：

```bash
cd my-vue-project
npm run serve
```

默认情况下，项目会在 `http://localhost:8080` 上运行。

## 使用 Vite 创建 Vue 3 项目

Vite 是一个现代化的前端开发构建工具，它利用原生 ES 模块的特性，提供了极快的冷启动速度和热更新能力。

#### 1. 创建项目

运行以下命令创建一个 Vue 3 项目：

```bash
npm create vite@latest my-vue3-project --template vue
```

- `my-vue3-project` 是项目名称。
- `--template vue` 指定使用 Vue 模板。

#### 2. 安装依赖

进入项目目录并安装依赖：

```bash
cd my-vue3-project
npm install
```

#### 3. 启动开发服务器

运行以下命令启动开发服务器：

```bash
npm run dev
```

默认情况下，项目会在 `http://localhost:5173` 上运行。

## 使用 Vue.js 官方模板（Vue 2）

如果你需要创建一个 Vue 2 项目，Vue.js 官方提供了一个简单的模板，可以通过以下方式快速搭建。

#### 1. 创建项目

运行以下命令创建一个 Vue 2 项目：

```bash
npm init vue@2
```

#### 2. 安装依赖

进入项目目录并安装依赖：

```bash
cd my-vue2-project
npm install
```

#### 3. 启动开发服务器

运行以下命令启动开发服务器：

```bash
npm run serve
```

默认情况下，项目会在 `http://localhost:8080` 上运行。

## 使用 Nuxt.js 创建 Vue 项目

Nuxt.js 是一个基于 Vue.js 的通用应用框架，它内置了许多强大的功能，如路由、状态管理、服务端渲染（SSR）等。

#### 1. 安装 Nuxt CLI

运行以下命令全局安装 Nuxt CLI：

```bash
npm install -g nuxt-cli
```

#### 2. 创建项目

运行以下命令创建一个 Nuxt.js 项目：

```bash
nuxt create my-nuxt-project
```

#### 3. 启动开发服务器

进入项目目录并启动开发服务器：

```bash
cd my-nuxt-project
npm run dev
```

默认情况下，项目会在 `http://localhost:3000` 上运行。

## 手动创建 Vue 项目

如果你希望完全控制项目的结构和配置，可以选择手动创建一个 Vue 项目。

#### 1. 创建项目目录

创建一个项目目录并初始化 npm 项目：

```bash
mkdir my-manual-vue-project
cd my-manual-vue-project
npm init -y
```

#### 2. 安装 Vue 和相关依赖

安装 Vue 和其他必要的依赖：

```bash
npm install vue
npm install vue-template-compiler --save-dev
```

#### 3. 创建入口文件

创建一个 `index.html` 文件和一个 `main.js` 文件：

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Manual Vue Project</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="./main.js"></script>
  </body>
</html>
```

```javascript
// main.js
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
```

#### 4. 创建 Vue 组件

创建一个 `App.vue` 文件：

```vue
<template>
  <div>
    <h1>Hello, Vue!</h1>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>
```

#### 5. 启动项目

使用一个简单的静态服务器（如 `http-server`）启动项目：

```bash
npm install -g http-server
http-server
```

## 总结

创建 Vue 项目有多种方式，每种方式都有其优缺点。以下是不同方式的适用场景总结：

- **Vue CLI**：适合需要强大功能和灵活配置的项目。
- **Vite**：适合 Vue 3 项目，追求快速开发和高效热更新。
- **Vue.js 官方模板**：适合快速搭建小型 Vue 2 项目。
- **Nuxt.js**：适合需要服务端渲染（SSR）或构建复杂应用的项目。
- **手动创建**：适合学习 Vue.js 基础原理或需要完全控制项目结构的场景。
