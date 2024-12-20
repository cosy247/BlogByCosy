import theme from 'vuepress-theme-pudding';

export default theme({
  title: '闲庭杂记',
  icon: 'assets/logo.icon',
  logo: 'assets/logo.png',
  description: '基于vuepress的的个人博客。李十七的个人博客。个人博客。',
  componentsPath: './components',
  shadowPassword: 'qeqe',
  template: {
    filePath: 'template.md',
    inputs: [
      { type: 'input', name: 'title', message: '文章标题:', required: true, default: (d) => d.$filename },
      { type: 'input', name: 'description', message: '文章描述:', default: (d) => d.title },
      { type: 'checkbox', name: 'tags', message: '文章标签:', choices: ['杂记', '技术', '生活', '随笔'], default: ['杂记'] },
      { type: 'list', name: 'archive', message: '文章归档:', choices: ['前端样式案例'] },
      {
        type: 'checkbox',
        name: 'recommendations',
        message: '相关推荐:',
        choices: (d) =>
          d.$pageList.map((p) => ({
            name: p.frontmatter.title,
            value: p.frontmatter.id,
          })),
      },
      { type: 'confirm', name: 'shadow', message: '是否隐藏:', default: 'n' },
      { type: 'number', name: 'top', message: '置顶等级:', default: 0 },
    ],
  },
  heads: [['link', { rel: 'stylesheet', href: 'styles/font.css' }]],
  mottos: [
    [
      '闻道有先后，术业有专攻。',
      'There is no chronological order in the pursuit of knowledge, and each field has its own experts.',
    ],
    ['耐心是人生的关键。', 'Patience is the key in life.'],
  ],
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
  menus: [
    {
      type: 'statistics',
      name: '标签',
      fontIcon: '&#xe617;',
      description: 'tag ∈ [1, N] · one;   one ∈ [0, 5] · tag',
      statistics: {
        pageName: 'tag',
        frontName: 'tags',
        isMultiple: true,
      },
    },
    // {
    //     type: 'statistics',
    //     name: '归档',
    //     fontIcon: '&#xe69d;',
    //     description: 'archive ∈ [1, N] · one;   one ∈ [0, 1] · archive',
    //     statistics: {
    //         pageName: 'archive',
    //         frontName: 'archive',
    //         isMultiple: false,
    //     },
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
          imgIcon: 'assets/README/DrinkWater.png',
          describe: '桌面小工具，用于定时提醒喝水。',
        },
        {
          name: 'VsBackground',
          url: 'https://marketplace.visualstudio.com/items?itemName=cosy247.vsBackground',
          imgIcon: 'assets/README/VsBackground.png',
          describe: 'VsCode插件，给页面添加背景图片。',
        },
        {
          name: 'PackOnePage',
          url: 'alones/PackOnePage/index.html',
          imgIcon: 'alones/PackOnePage/icon/icon.png',
          describe: '将html网页的js和css打包成一个html文件。',
        },
      ],
    },
  ],
});
