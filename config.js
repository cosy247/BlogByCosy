let base = '/';
if (import.meta.env?.BASE) {
  base = import.meta.env.BASE;
} else if (typeof process !== 'undefined' && process.env?.BASE) {
  base = process.env.BASE;
}
console.log('💎💎💎', base);

export default {
  title: 'BlogByCosy',
  description: 'BlogByCosy',
  srcDir: './docs',
  base,
  vite: {
    server: {
      port: 2470,
    },
  },
  appearance: 'dark',
  // 配置代码高亮主题
  shikiConfig: {
    theme: 'dark', // 使用 Dracula 主题
  },

  // 项目自动生成文件路径
  tempDir: '/temp',
  // 打包路径
  outDir: './BlogByCosy',
  // 高亮代码支持的语言
  codeLangs: ['javascript', 'vue', 'text', 'shell', 'json', 'html', 'css'],
  // 高亮代码支持的语言别名
  codeLangAlias: { js: 'javascript' },
  // 页面显示标题，浏览器 tab 标题在 index.html 中设置
  pageTitle: '<p class="c-page-title">C<img src="./logo.png"/>SY247</p>',
  // 是否开启相似推荐，0表示不开启，大于0将为补充至推荐文章数
  similarRecommendNumber: 5,
  // 全局组件目录
  componentDir: '/components',

  head: [['link', { rel: 'icon', href: './logo.png' }]],

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
    {
      fontIcon: '&#xe79d;',
      name: 'npm',
      url: 'https://www.npmjs.com/~cosy247',
    },
  ],
  toc: {
    auto: true, // 自动生成目录
    level: [2, 3, 4], // 目录支持的标题级别（例如，##、###、####）
    linkIcons: true, // 是否在目录项旁边显示链接图标
  },
  // 页面顶部的菜单设置
  menus: [
    {
      type: 'classify',
      name: '标签',
      fontIcon: '&#xe617;',
      description: 'tag ∈ [1, N] · one;   one ∈ [0, 5] · tag',
      classify: {
        /** 统计名称 */
        name: 'tag',
        /** 是否为多选属性 */
        multiple: true,
      },
    },
    // {
    //   type: 'classify',
    //   name: '归档',
    //   fontIcon: '&#xe69d;',
    //   description: 'archive ∈ [1, N] · one;   one ∈ [0, 1] · archive',
    //   classify: {
    //     pageName: 'archive',
    //     frontName: 'archive',
    //     multiple: false,
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
          imgIcon: './DrinkWater.png',
          describe: '桌面小工具，用于定时提醒喝水。',
        },
        {
          name: 'VsBackground',
          url: 'https://marketplace.visualstudio.com/items?itemName=cosy247.vsBackground',
          imgIcon: './VsBackground.png',
          describe: 'VsCode插件，给页面添加背景图片。',
        },
        {
          name: 'PackOnePage',
          url: 'https://cosy247.top/alones/PackOnePage/index.html',
          imgIcon: 'https://cosy247.github.io/PackOnePage/icon/icon.ico',
          describe: '将html网页的js和css打包成一个html文件。',
        },
        {
          name: 'MarkdownInSider',
          url: 'https://marketplace.visualstudio.com/items?itemName=cosy247.markdown-in-sider',
          imgIcon: './MarkdownInSider.png',
          describe: 'VSCode 插件，可以在侧边栏编辑 Markdown。',
        },
      ],
    },
    // {
    //   type: 'link',
    //   name: '留言',
    //   fontIcon: '&#xe744;',
    //   link: '/comment',
    // },
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
