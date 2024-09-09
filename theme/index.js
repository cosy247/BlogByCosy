import blogMateData from "./plugins/blogMate.js";
import { tocPlugin } from "@vuepress/plugin-toc";
import { activeHeaderLinksPlugin } from "@vuepress/plugin-active-header-links";
import { viteBundler } from "@vuepress/bundler-vite";
import { copyCodePlugin } from "@vuepress/plugin-copy-code";
import { shikiPlugin } from "@vuepress/plugin-shiki";
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance";
import { containerPlugin } from "@vuepress/plugin-container";
import { getDirname, path } from "@vuepress/utils";
import { gitPlugin } from "@vuepress/plugin-git";

export default (option = {}) => {
  const initOption = {
    theme: "cosy",
    clientConfigFile: path.resolve(getDirname(import.meta.url), "./client.js"),
    // 网页信息设置
    title: "cosy247博客",
    lang: "zh-Hans-CN",
    description: "cosy247的个人博客 master",
    head: [
      ["link", { rel: "icon", href: "/assets/logo.png" }],
      ["meta", { "http-equiv": "Cache-Control", content: "max-age=7200" }],
    ],
    // 运行设置
    temp: "./.temp",
    cache: "./.cache",
    public: "./docs",
    dest: "./_CosyBlog",
    permalinkPattern: ":raw",
    bundler: viteBundler({
      viteOptions: {},
      vuePluginOptions: {},
    }),
    // 语言设置
    locales: {
      "/": {
        lang: "zh",
        title: "VuePress",
        description: "Vue 驱动的静态网站生成器",
      },
    },
    // 插件
    plugins: [
      gitPlugin({}),
      blogMateData({
        countMateNames: ["tags", "archive"],
        isArrMateNames: ["tags"],
      }),
      tocPlugin({}),
      activeHeaderLinksPlugin({
        headerLinkSelector: "a.vuepress-toc-link",
        delay: 0,
        offset: 100,
      }),
      copyCodePlugin({
        selector: '.mdContent div[class*="language-"] pre',
        locales: {
          "/": {
            copied: "😘",
          },
        },
      }),
      shikiPlugin({
        theme: "one-dark-pro",
      }),
      // https://plugin-md-enhance.vuejs.press/zh/guide/
      mdEnhancePlugin({
        tabs: true,
        echarts: true,
        mermaid: true,
        // 启用图片懒加载
        imgLazyload: true,
        // 启用图片标记
        imgMark: true,
        // 启用图片大小
        imgSize: true,
      }),
    ],
    ...option,
  };

  // componentsPath 属性，目录下注册 md 文档中主键
  if (option.componentsPath) {
    const { registerComponentsPlugin } = require("@vuepress/plugin-register-components");
    const fs = require("fs");

    initOption.plugins.push(
      registerComponentsPlugin({
        componentsDir: option.componentsPath,
      })
    );
    initOption.plugins.push(
      ...fs.readdirSync(option.componentsPath).map((file) => {
        const [fileName] = file.split(".");
        return containerPlugin({
          type: fileName.toLowerCase(),
          before: (...info) => `<ClientOnly><${fileName} info="${info}">\n`,
          after: () => `</${fileName}></ClientOnly>\n`,
        });
      })
    );
  }

  return initOption;
};
