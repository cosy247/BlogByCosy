---
id: 1737429447213 # 文章id
date: 2025/01/21 15:35
title: Vue Cli的 mode 模式和 env 环境变量 # 文章标题
description: Vue Cli 的mode 模式和 env 环境变量 # 文章描述
tag: Vue 前端 # 文章标签
archive: # 文章归档
recommendations: 1737444286721 # 相关推荐id
shadow: false # 是否隐藏
top: 0 # 是否zhi置顶，数字越大优先级越高
---

# Vue Cli 的 mode 模式和 env 环境变量

在一个项目的开发过程通常会有开发，测试，发布等过程，在这些不同过程中常常会有一些配置差异（例如请求的 API 基础地址，错误日志的分类，网站的标题图标等）。开发，测试，发布可以看作不同的运行模式（mode 模式），我们可以更加不同模式写入不同的配置（env 环境变量）。

## 模式

Vue CLI 默认提供了三种默认模式，用于区分开发、测试和生产环境：

- development：用于开发环境，通过 `vue-cli-service serve` 启动。
- production：用于生产环境，通过 `vue-cli-service build` 构建。
- test：用于单元测试环境，通过 `vue-cli-service test:unit` 启动。

也可以在启动时使用--mode 参数覆盖，如将 mode 设置为 temp：

```shell title=hidden
vue-cli-service serve --mode temp
```

Vue Cli 在不同模式下会自动查找对应的 env 配置文件。

## env 文件

一般 env 文件与 package.json 文件同级，名称为 `.env[.mode](.local)`。如 `.env`，`.env.development`，`.env.development.local`。

- `.env` 在任何模式都会加载
- `.env.development` 在 development 模式加载
- `.env.development.local` 在 development 模式加载，一般不会上传 git（.gitignore 中配置了 `*.local`）

文件内容为每行键值对形式存在，如：

```shell title=".env.development"
FOO=foo
USER_KEY=userId
VUE_APP_NOT_SECRET_CODE=some_value
```

如果想修改环境变量但是不修改 env 文件，可以在 package.json 的运行命令行中直接写入：

```json title="package.json"
{
  "scripts": {
    "dev": "set VUE_APP_USER_KEY=UserName && vue-cli-service serve",
    "build": "set VUE_APP_USER_KEY=UserId && set VUE_APP_API=https && vue-cli-service build"
  }
}
```

当一个值可以被多种方式或文件定义时，`命令行` > `.env.development.local` > `.env.development` > `.env`;

并不是全部 env 配置都会被加载，只有名为 `NODE_ENV` 或 `BASE_URL` 和以 `VUE_APP_` 开头的属性才会被加载。

```shell title='.env'
NODE_ENV=development # 满足
VUE_VERSION=2.2.3 # 不满足
VUE_APP_BASE_API=localhost:8080/ # 满足
```

- `NODE_ENV` 会是 "development"、"production" 或 "test" 中的一个。具体的值取决于应用运行的模式。
- `BASE_URL` 会和 vue.config.js 中的 publicPath 选项相符，即你的应用会部署到的基础路径。

> > 由于任何环境变量都是一次读取的，所以在更改后需要重启服务器才可以获取到新值。

## 读取 env 属性

在项目中可以访问 `process.env.[envName]` 来获取具体的值。

```js
console.log(process.env.NODE_ENV);
// 'development'
console.log(process.env.VUE_APP_BASE_API);
// 'localhost:8080/'
```

## 参考

[模式和环境变量 | Vue CLI](https://cli.vuejs.org/zh/guide/mode-and-env.html)
