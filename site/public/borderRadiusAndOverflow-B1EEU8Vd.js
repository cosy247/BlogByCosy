const r=`---\r
id: 3\r
date: 2023/11/21\r
title: CSS圆角borderRadius的内容溢出问题\r
tags: CSS 前端\r
description: CSS属性中的圆角borderRadius和溢出overflow的之间可能存在的冲突情况\r
---\r
\r
# CSS圆角borderRadius的内容溢出问题\r
\r
在 CSS 中[border-radius](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-radius)属性可以为元素添加圆角。行为圆角矩形或者椭圆（圆）。[overflow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/overflow)属性可以设置元素溢出时所需的行为。一般设置为 auto，自动显示或者隐藏滚动条。\r
\r
## 问题描述\r
\r
当一个元素设置了圆角但是其没有设置 padding，又恰好其子元素存在背景颜色，那么可能出现以下的情况：\r
\r
![Alt text](assets/borderRadiusAndOverflow/image-1.png)\r
\r
\`\`\`html\r
<style>\r
    .s-outer {\r
        border-radius: 10px;\r
        background: yellowgreen;\r
        width: 100px;\r
        height: 40px;\r
        margin: 20px auto;\r
    }\r
    .s-inner {\r
        background: wheat;\r
        width: 20px;\r
        height: 20px;\r
    }\r
</style>\r
<div class="s-outer">\r
    <div class="s-inner"></div>\r
</div>\r
\`\`\`\r
\r
其中左上角的圆角被子元素覆盖。\r
\r
## 解决方案\r
\r
其中问题出现的原因是子元素位置是正确的，但是圆角是在元素内容区域下进行收缩的，导致内容区域的圆角区域缺失，但是其子元素并不会去检测这一信息，导致了这种情况的发生。\r
\r
解决方式：\r
\r
1. 给父元素添加 overflow 属性，只要计算属性出不为 visible 即可。auto，scroll，clip，hidden 都是可行的，都会将移除内容区域的部分隐藏掉。但是如果是文字溢出的话文字也会被隐藏超出部分。\r
\r
2. 给父元素添加 padding，父元素的内容区域与圆角有一定的距离。\r
\r
3. 给可能溢出圆角的子元素添加 margin 或者 margin，让子元素自身与圆角有一定的距离。\r
\r
4. 给可能溢出圆角的子元素添加对应方向对应大小的圆角，但是如果是文字溢出的话是不能解决的。\r
\r
5. 如果是背景颜色溢出，可以考虑让父元素设置背景颜色，子元素取消背景颜色的设置。\r
\r
其中原理就是添加内容与圆角的距离让内容不影响圆角，或者将影响的部分隐藏掉。\r
`;export{r as default};
