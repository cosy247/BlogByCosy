---
id: 1737444286721 # 文章id
date: 2025/01/22 11:02
title: Vite 模式与环境变量 # 文章标题
description: Vite 模式与环境变量 # 文章描述
tag: Vite 前端 # 文章标签
archive: # 文章归档
recommendations: 1737429447213 # 相关推荐id
shadow: false # 是否隐藏
top: 0 # 是否zhi置顶，数字越大优先级越高
---

# Vite 模式与环境变量

在了解 Vite 的模式与环境变量前建议先了解 [Vue Cli 的 mode 模式和 env 环境变量](./VueCliModeAndEnv)，其大部分的内容都是相同的。

> 以下只讲其不同点

# 环境

默认有开发模式 development 和生产模式 production，可以通过 `--mode` 来指定模式。

```shell title=hidden
vite build --mode staging
```

# env 文件

与 package.json 同级，名为 `env[.mode](.local)`。在文件中只有以 `VITE_` 为前缀的变量才会暴露:

```shell
VITE_SOME_KEY=123 # 暴露
DB_PASSWORD=foobar # 不暴露
```

> 如果想使用其他属性前缀，可以在项目的 `vite.config.js` 中配置 `envPrefix` 属性。

# 读取 env 属性

在项目中通过访问 `import.meta.env` 的属性来获取设置的 env 属性。其中有一些是已经存在的属性：

- `import.meta.env.MODE`: {string} 应用运行的模式。
- `import.meta.env.BASE_URL`: {string} 部署应用时的基本 URL。他由 base 配置项决定。
- `import.meta.env.PROD`: {boolean} 应用是否运行在生产环境。
- `import.meta.env.DEV`: {boolean} 应用是否运行在开发环境 (永远与 import.meta.env.PROD 相反)。
- `import.meta.env.SSR`: {boolean} 应用是否运行在 server 上。

```js
console.log(process.env.VITE_SOME_KEY);
// '123'
console.log(process.env.DB_PASSWORD);
// 'undefined'
```

## 参考

[环境变量和模式 | Vite 官方中文文档](https://cn.vitejs.dev/guide/env-and-mode)
