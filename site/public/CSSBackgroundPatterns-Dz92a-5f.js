const r=`---\r
id: 1739258073953 # 文章id\r
title: CSS 背景实现条纹，栅格，圆点等背景 # 文章标题\r
description: CSS 背景实现条纹，栅格，圆点等背景 # 文章描述\r
tags: CSS 前端 # 文章标签\r
archive: # 文章归档\r
recommendations: # 相关推荐id\r
shadow: false # 是否隐藏\r
top: 0 # 是否zhi置顶，数字越大优先级越高\r
---\r
\r
# CSS 背景实现条纹，栅格，圆点等背景\r
\r
对于一些规则，简单的平铺背景，可以尝试使用 \`background\` 属性进行绘制。\r
\r
通常是先绘制最小单位后，通过循环方式来达到平铺的效果。\r
\r
## 条纹背景\r
\r
使用 [repeating-linear-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/repeating-linear-gradient) 重复线性渐变绘制基础条纹，当颜色渐变节点相同时会直接进行颜色切换（没有空间进行过渡），实现颜色条拼接的效果：\r
\r
:::Dome\r
\r
<div class="background"></div>\r
\r
<style>\r
  .background {\r
    height: 100px;\r
    width: 100%;\r
    background: repeating-linear-gradient(\r
      45deg, /* 90度表示水平方向 */ \r
      #f70a8dea, /* 第一种颜色 */ \r
      #f70a8dea 10px, /* 第一种颜色的宽度 */ \r
      #0366d6ea 10px, /* 第二种颜色 */ \r
      #0366d6ea 20px /* 第二种颜色的宽度 */\r
    );\r
  }\r
</style>\r
\r
:::\r
\r
> 背景会默认循环\r
\r
## 栅格背景\r
\r
与条纹背景类似，使用 [linear-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/linear-gradient) 线性渐变。 主要区别是渐变是宽度的控制：\r
\r
:::Dome\r
\r
<div class="background"></div>\r
\r
<style>\r
  .background {\r
    height: 100px;\r
    width: 100%;\r
    background: linear-gradient(90deg, #8a7 1px, transparent 1px) 5px/15px 15px,\r
                linear-gradient(0deg, #8a7 1px, transparent 1px) 5px/15px 15px;\r
  }\r
</style>\r
\r
:::\r
\r
其中 background 属性展开如下：\r
\r
\`\`\`css\r
css {\r
  background-image: linear-gradient(90deg, #8a7 1px, transparent 1px), linear-gradient(0deg, #8a7 1px, transparent 1px);\r
  background-position-x: 5px, 5px;\r
  background-position-y: center, center;\r
  background-size: 15px 15px, 15px 15px;\r
}\r
\`\`\`\r
\r
绘制了两个方向的线，每个属性逗号分隔开一一对应。其中 \`background-size\` 属性表示了单元格的大小，\`background-position\` 属性从什么地方开始绘制。\r
\r
## 圆点背景\r
\r
单个圆点通过径向渐变 [radial-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/radial-gradient) 实现，再结合背景的复制进行平铺。\r
\r
:::Dome\r
\r
<div class="background"></div>\r
\r
<style>\r
  .background {\r
    height: 100px;\r
    width: 100%;\r
    background: radial-gradient(#8a7 45%, transparent 50%) 0px/20px 20px;\r
  }\r
</style>\r
\r
:::\r
\r
> > 如果设置 \`radial-gradient(#8a7 50%, transparent 50%)\`，得到的圆形往往不理想。给第一个颜色设置 45% 的位置，留下 5% 来过渡会得到比较理想的圆形。\r
\r
## 其他背景\r
\r
:::Dome title=点阵背景\r
\r
<div class="background"></div>\r
\r
<style>\r
  .background {\r
    height: 100px;\r
    width: 100%;\r
    filter: con;\r
    background: linear-gradient(45deg, #eee 25%, #0000 25%, #0000 75%, #eee 75%) 0 0/31px 31px,\r
                linear-gradient(45deg, #eee 25%, #0000 25%, #0000 75%, #eee 75%) 15px 15px/31px 31px;\r
  }\r
</style>\r
\r
:::\r
\r
:::Dome title=格子衬衫\r
\r
<div class="background"></div>\r
\r
<style>\r
  .background {\r
    height: 100px;\r
    width: 100%;\r
    filter: con;\r
    background: linear-gradient(0deg, #9a78 50%, #0000 50%) 0px 0px/30px 30px,\r
                linear-gradient(90deg, #9a78 50%, #0000 50%) 15px 15px/30px 30px;\r
  }\r
</style>\r
\r
:::\r
\r
:::Dome title=你好\r
\r
<div class="background"></div>\r
\r
<style>\r
  .background {\r
    height: 100px;\r
    width: 100%;\r
    filter: con;\r
    background: linear-gradient(#0008 20%, #a328 0) 10% 10%/40% 20% no-repeat,\r
                linear-gradient(#0008 20%, #2e28 0) 90% 10%/30% 30% no-repeat,\r
                linear-gradient(#000 0, #22e8 0) 50% 50%/10% 70% no-repeat,\r
                radial-gradient(#000 0, #2e28 0) 50% 100%/20% 10% no-repeat;\r
  }\r
</style>\r
\r
:::\r
`;export{r as default};
