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

const __dirname = getDirname(import.meta.url);

export default (pConfig = {}) => {
  const config = {
    /** 文章与静态资源路径 */
    docsPath: "./docs",

    /** 网站标题 */
    title: "李十七的个人博客",
    /** 网站介绍 */
    description: "基于vuepress的的个人博客。李十七的个人博客。个人博客。",
    /** 头部标签 */
    head: [],
    /** 网站图标 */
    icon: "./docs/assets/logo.png",

    /** 隐藏文件密码 */
    shadowPassword: "qeqe",
    /** 菜单项 */
    menus: [
      {
        /** 菜单类型 statistics exhibit */
        menuType: "statistics",
        /** 菜单标题 */
        menuName: "&#xe617; 标签",
        /** 菜单描述 */
        description: "tag ∈ [1, N] · one;   one ∈ [0, 5] · tag",
        /** statistics 相关属性 */
        statistics: {
          /** 页面标题 */
          pageName: "tag",
          /** 统计的属性名 */
          frontName: "tags",
          /** 是否为多值统计属性 */
          isMultiple: true,
        },
      },
      {
        menuType: "statistics",
        menuName: "&#xe69d; 归档",
        description: "archive ∈ [1, N] · one;   one ∈ [0, 1] · archive",
        /** statistics 相关属性 */
        statistics: {
          pageName: "archive",
          frontName: "archive",
          isMultiple: false,
        },
      },
      {
        menuType: "exhibit",
        menuName: "&#xe64f; 独立",
        description: "独立于本网站的应用、网页、服务、插件等。",
        /** exhibit 相关属性 */
        exhibit: [
          { name: "Sevg", url: "https://cosy247.top/sevg", img: "assets/README/Sevg.png" },
          {
            name: "DrinkWater",
            url: "https://github.com/cosy247/DrinkWater",
            img: "assets/README/DrinkWater.png",
          },
          {
            name: "VsBackground",
            url: "https://marketplace.visualstudio.com/items?itemName=cosy247.vsBackground",
            img: "assets/README/VsBackground.png",
          },
        ],
      },
      // {
      //   menuType: "introduce",
      //   menuName: "&#xe66d; 友链",
      //   description: "相逢何必曾相识，联系我创建关联。",
      //   /** 介绍页内容文件：.vue .md .html */
      //   componentFile: "/docs/components/introduce.vue",
      // },
    ],
    /** 首页座右铭 */
    motto: [
      ["我不吃牛肉。", "I don't eat beef."],
      ["他走了，像是下定了某种决心。", "He left, as if he had made up his mind."],
      ["耐心是人生的关键。", "Patience is the key in life."],
    ],
    /** 首页作者链接 */
    links: [
      { name: "&#xe673;github", url: "https://github.com/cosy247" },
      {
        name: "&#xe600;邮箱",
        url: "http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=al1aX1tTXlxdWSobG0QJBQc",
      },
    ],

    // 追加用户配置
    ...pConfig,
  };

  const pageConfig = {
    motto: config.motto,
    links: config.links,
    shadowPassword: config.shadowPassword,
    countMateNames: config.menus
      .filter((item) => item.menuType === "statistics")
      .map((item) => item.statistics.frontName),
    isArrMateNames: config.menus
      .filter((item) => item.menuType === "statistics" && item.statistics.isMultiple)
      .map((item) => item.statistics.frontName),
    menus: config.menus,
  };

  const initOption = {
    theme: "cosy",
    clientConfigFile: path.resolve(getDirname(import.meta.url), "./client.js"),
    // 网页信息设置
    title: config.title,
    lang: "zh-Hans-CN",
    description: config.description,
    head: [
      ["title", {}, config.title],
      ["link", { rel: "icon", href: config.icon }],
      ["meta", { "http-equiv": "Cache-Control", content: "max-age=7200" }],
      ...config.head,
    ],
    // 运行设置
    temp: "./.temp",
    cache: "./.cache",
    public: config.docsPath,
    dest: "./_CosyBlog",
    permalinkPattern: ":raw",
    bundler: viteBundler({
      viteOptions: {},
      vuePluginOptions: {},
    }),
    // 语言设置
    // locales: {
    //   "/": {
    //     lang: "zh",
    //     title: "VuePress",
    //     description: "Vue 驱动的静态网站生成器",
    //   },
    // },
    // 插件
    plugins: [
      gitPlugin({}),
      blogMateData({
        config: pageConfig,
        countMateNames: pageConfig.countMateNames,
        isArrMateNames: pageConfig.isArrMateNames,
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
  };

  // componentsPath 属性，目录下注册 md 文档中主键
  if (config.componentsPath) {
    const { registerComponentsPlugin } = require("@vuepress/plugin-register-components");
    const fs = require("fs");

    initOption.plugins.push(
      registerComponentsPlugin({
        componentsDir: config.componentsPath,
      })
    );
    initOption.plugins.push(
      ...fs.readdirSync(config.componentsPath).map((file) => {
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
