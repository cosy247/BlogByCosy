export default {
  // 项目自动生成文件路径
  tempDir: '/temp',
  // 打包路径
  outDir: './BlogByCosy',
  // 高亮代码支持的语言
  codeLangs: ['javascript', 'vue', 'text', 'shell', 'json', 'html', 'css'],
  // 高亮代码支持的语言别名
  codeLangAlias: { js: 'javascript' },
  // 页面显示标题，浏览器 tab 标题在 index.html 中设置
  title: '<p class="c-page-title">C<img src="/assets/images/logo.ico"/>SY247</p>',
  // 是否开启相似推荐，0表示不开启，大于0将为补充至推荐文章数
  similarRecommendNumber: 5,
  // 全局组件目录
  componentDir: '/components',
  // 首页座右铭
  mottos: [
    [
      '闻道有先后，术业有专攻。',
      'There is no chronological order in the pursuit of knowledge, and each field has its own experts.',
    ],
    ['耐心是人生的关键。', 'Patience is the key in life.'],
  ],
  // 首页连接
  links: [
    {
      fontIcon: '&#xe673;',
      name: 'github',
      url: 'https://github.com/cosy247',
    },
    {
      fontIcon: '&#xe600;',
      name: '邮箱',
      url: 'http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=al1aX1tTXlxdWSobG0QJBQc',
    },
  ],
  // 评论配置
  giscus: {
    src: 'https://giscus.app/client.js',
    repo: 'cosy247/BlogByCosy',
    repoId: 'R_kgDOJI48fw',
    category: 'Announcements',
    categoryId: 'DIC_kwDOJI48f84Ceg84',
    mapping: 'url',
    strict: '0',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'top',
    theme: 'preferred_color_scheme',
    lang: 'zh-CN',
    crossorigin: 'anonymous',
    // async: true,
  },
  // 页面顶部的菜单设置
  menus: [
    {
      type: 'statistics',
      name: '标签',
      fontIcon: '&#xe617;',
      description: 'tag ∈ [1, N] · one;   one ∈ [0, 5] · tag',
      statistics: {
        /** 页面显示名称 */
        pageName: 'tag',
        /** 文章统计名称 */
        frontName: 'tags',
        /** 是否为多选属性 */
        isMultiple: true,
      },
    },
    // {
    //   type: 'statistics',
    //   name: '归档',
    //   fontIcon: '&#xe69d;',
    //   description: 'archive ∈ [1, N] · one;   one ∈ [0, 1] · archive',
    //   statistics: {
    //     pageName: 'archive',
    //     frontName: 'archive',
    //     isMultiple: false,
    //   },
    // },
    {
      type: 'exhibit',
      name: '独立',
      fontIcon: '&#xe64f;',
      description: '独立于本网站的应用、网页、服务、插件等。',
      exhibit: [
        {
          name: 'DrinkWater',
          url: 'https://github.com/cosy247/DrinkWater',
          imgIcon: '/assets/images/DrinkWater.png',
          describe: '桌面小工具，用于定时提醒喝水。',
        },
        {
          name: 'VsBackground',
          url: 'https://marketplace.visualstudio.com/items?itemName=cosy247.vsBackground',
          imgIcon: '/assets/images/VsBackground.png',
          describe: 'VsCode插件，给页面添加背景图片。',
        },
        {
          name: 'PackOnePage',
          url: 'https://cosy247.top/alones/PackOnePage/index.html',
          imgIcon: 'https://cosy247.top/alones/PackOnePage/icon/icon.png',
          describe: '将html网页的js和css打包成一个html文件。',
        },
      ],
    },
    {
      type: 'link',
      name: '留言',
      fontIcon: '&#xe744;',
      link: '/docs/Comment',
    },
  ],
  // 脚本生成文章的模板设置
  template: {
    filePath: 'template.md',
    inputs: [
      { type: 'input', name: 'title', message: '文章标题:', required: true, default: (d) => d.$filename },
      { type: 'input', name: 'description', message: '文章描述:', default: (d) => d.title },
      {
        type: 'checkbox',
        name: 'tags',
        message: '文章标签:',
        choices: [
          { name: '随笔', checked: true },
          'Window使用',
          'Vscode使用',
          'NPM',
          '图集',
          '前端',
          '后端',
          'JS',
          'CSS',
          'HTML',
          'Vue',
          'React',
          'Node',
          'Python',
        ],
        required: true,
      },
      { type: 'list', name: 'archive', message: '文章归档:', choices: ['', '前端小dome'] },
      {
        type: 'checkbox',
        name: 'recommendations',
        message: '相关推荐:',
        choices: (d) =>
          d.$pageList.map((p) => ({
            name: p.attrs.title,
            value: p.attrs.id,
          })),
      },
      { type: 'confirm', name: 'shadow', message: '是否隐藏:', default: false },
      { type: 'number', name: 'top', message: '置顶等级:', default: 0 },
    ],
  },
};
