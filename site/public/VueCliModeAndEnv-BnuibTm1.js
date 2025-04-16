const e=`---\r
id: 1737429447213 # 文章id\r
title: Vue Cli的 mode 模式和 env 环境变量 # 文章标题\r
description: Vue Cli 的mode 模式和 env 环境变量 # 文章描述\r
tags: Vue 前端 # 文章标签\r
archive: # 文章归档\r
recommendations: 1737444286721 # 相关推荐id\r
shadow: false # 是否隐藏\r
top: 0 # 是否zhi置顶，数字越大优先级越高\r
---\r
\r
# Vue Cli 的 mode 模式和 env 环境变量\r
\r
在一个项目的开发过程通常会有开发，测试，发布等过程，在这些不同过程中常常会有一些配置差异（例如请求的 API 基础地址，错误日志的分类，网站的标题图标等）。开发，测试，发布可以看作不同的运行模式（mode 模式），我们可以更加不同模式写入不同的配置（env 环境变量）。\r
\r
## 模式\r
\r
Vue CLI 默认提供了三种默认模式，用于区分开发、测试和生产环境：\r
\r
- development：用于开发环境，通过 \`vue-cli-service serve\` 启动。\r
- production：用于生产环境，通过 \`vue-cli-service build\` 构建。\r
- test：用于单元测试环境，通过 \`vue-cli-service test:unit\` 启动。\r
\r
也可以在启动时使用--mode 参数覆盖，如将 mode 设置为 temp：\r
\r
\`\`\`shell title=hidden\r
vue-cli-service serve --mode temp\r
\`\`\`\r
\r
Vue Cli 在不同模式下会自动查找对应的 env 配置文件。\r
\r
## env 文件\r
\r
一般 env 文件与 package.json 文件同级，名称为 \`.env[.mode](.local)\`。如 \`.env\`，\`.env.development\`，\`.env.development.local\`。\r
\r
- \`.env\` 在任何模式都会加载\r
- \`.env.development\` 在 development 模式加载\r
- \`.env.development.local\` 在 development 模式加载，一般不会上传 git（.gitignore 中配置了 \`*.local\`）\r
\r
文件内容为每行键值对形式存在，如：\r
\r
\`\`\`shell title=".env.development"\r
FOO=foo\r
USER_KEY=userId\r
VUE_APP_NOT_SECRET_CODE=some_value\r
\`\`\`\r
\r
如果想修改环境变量但是不修改 env 文件，可以在 package.json 的运行命令行中直接写入：\r
\r
\`\`\`json title="package.json"\r
{\r
  "scripts": {\r
    "dev": "set VUE_APP_USER_KEY=UserName && vue-cli-service serve",\r
    "build": "set VUE_APP_USER_KEY=UserId && set VUE_APP_API=https && vue-cli-service build"\r
  }\r
}\r
\`\`\`\r
\r
当一个值可以被多种方式或文件定义时，\`命令行\` > \`.env.development.local\` > \`.env.development\` > \`.env\`;\r
\r
并不是全部 env 配置都会被加载，只有名为 \`NODE_ENV\` 或 \`BASE_URL\` 和以 \`VUE_APP_\` 开头的属性才会被加载。\r
\r
\`\`\`shell title='.env'\r
NODE_ENV=development # 满足\r
VUE_VERSION=2.2.3 # 不满足\r
VUE_APP_BASE_API=localhost:8080/ # 满足\r
\`\`\`\r
\r
- \`NODE_ENV\` 会是 "development"、"production" 或 "test" 中的一个。具体的值取决于应用运行的模式。\r
- \`BASE_URL\` 会和 vue.config.js 中的 publicPath 选项相符，即你的应用会部署到的基础路径。\r
\r
> > 由于任何环境变量都是一次读取的，所以在更改后需要重启服务器才可以获取到新值。\r
\r
## 读取 env 属性\r
\r
在项目中可以访问 \`process.env.[envName]\` 来获取具体的值。\r
\r
\`\`\`js\r
console.log(process.env.NODE_ENV);\r
// 'development'\r
console.log(process.env.VUE_APP_BASE_API);\r
// 'localhost:8080/'\r
\`\`\`\r
\r
## 参考\r
\r
[模式和环境变量 | Vue CLI](https://cli.vuejs.org/zh/guide/mode-and-env.html)\r
`;export{e as default};
