const r=`---\r
id: 1738983236754 # 文章id\r
title: CSS 旋转加载动画 # 文章标题\r
description: CSS 旋转加载动画 # 文章描述\r
tags: CSS 前端 # 文章标签\r
archive: # 文章归档\r
recommendations: # 相关推荐id\r
shadow: false # 是否隐藏\r
top: 0 # 是否zhi置顶，数字越大优先级越高\r
---\r
\r
# CSS 旋转加载动画\r
\r
:::Dome title=基础旋转 info='使用 border 画圆'\r
\r
<div class="flex">\r
  <div class="circle circle1"></div>\r
  <div class="circle circle2"></div>\r
  <div class="circle circle3"></div>\r
</div>\r
\r
<style>\r
  .flex {\r
    display: flex;\r
    justify-content: space-evenly;\r
    flex-wrap: wrap;\r
    gap: 20px;\r
    align-items: center;\r
  }\r
\r
  /* 整体 */\r
  .circle {\r
    font-size: 50px;\r
    width: 1em;\r
    height: 1em;\r
    border-radius: 50%;\r
    border: 0.15em solid #2a5e88;\r
    animation: rotate 1s infinite linear;\r
  }\r
\r
  /* 个体1 */\r
  .circle1 {\r
    border-left-color: transparent;\r
  }\r
  \r
  /* 个体2 */\r
  .circle2 {\r
    border-left-color: transparent;\r
    border-right-color: transparent;\r
  }\r
  \r
  /* 个体3 */\r
  .circle3 {\r
    border-left-color: #2a5e8833;\r
    border-right-color: #2a5e8833;\r
  }\r
\r
  /* 动画 */\r
  @keyframes rotate {\r
    0% {\r
      transform: rotate(0deg);\r
    }\r
    100% {\r
      transform: rotate(360deg);\r
    }\r
  }\r
</style>\r
\r
:::\r
\r
:::Dome title=多层旋转 info='使用 after before 伪元素'\r
\r
<div class="flex">\r
  <div class="circle circle1"></div>\r
  <div class="circle circle2"></div>\r
</div>\r
\r
<style>\r
  .flex {\r
    display: flex;\r
    justify-content: space-evenly;\r
    flex-wrap: wrap;\r
    gap: 20px;\r
    align-items: center;\r
  }\r
\r
  /* 整体 */\r
  .circle {\r
    position: relative;\r
    font-size: 50px;\r
    width: 1em;\r
    height: 1em;\r
    border-radius: 50%;\r
    border: 0.1em solid #2a5e88;\r
    animation: rotate 1s infinite linear;\r
  }\r
  .circle::before {\r
    content: '';\r
    position: absolute;\r
    width: 1.3em;\r
    height: 1.3em;\r
    left: -0.25em;\r
    top: -0.25em;\r
    border-radius: 50%;\r
    border: 0.1em solid #2a5e88;\r
  }\r
  .circle::after {\r
    content: '';\r
    position: absolute;\r
    width: 0.7em;\r
    height: 0.7em;\r
    left: 0.05em;\r
    top: 0.05em;\r
    border-radius: 50%;\r
    border: 0.1em solid #2a5e88;\r
  }\r
\r
  /* 个体1 */\r
  .circle1 {\r
    border-left-color: transparent;\r
    border-right-color: transparent;\r
  }\r
  .circle1::before {\r
    border-color: #a87;\r
    border-left-color: transparent;\r
    border-right-color: transparent;\r
    animation: rotate 2s infinite linear reverse;\r
  }\r
  .circle1::after {\r
    border-color: #8a7;\r
    border-left-color: transparent;\r
    border-right-color: transparent;\r
    animation: rotate 3s infinite linear;\r
  }\r
  \r
  /* 个体2 */\r
  .circle2 {\r
    border-left-color: transparent;\r
    border-right-color: transparent;\r
    border-top-color: transparent;\r
  }\r
  .circle2::before {\r
    border-color: #a87;\r
    border-left-color: transparent;\r
    border-right-color: transparent;\r
    border-top-color: transparent;\r
    animation: rotate 2s infinite linear reverse;\r
  }\r
  .circle2::after {\r
    border-color: #8a7;\r
    border-left-color: transparent;\r
    border-right-color: transparent;\r
    border-top-color: transparent;\r
    animation: rotate 2s infinite linear;\r
  }\r
  \r
  /* 动画 */\r
  @keyframes rotate {\r
    0% {\r
      transform: rotate(0deg);\r
    }\r
    100% {\r
      transform: rotate(360deg);\r
    }\r
  }\r
</style>\r
\r
:::\r
\r
:::Dome title=动态旋转 info='使用 clip-path 进行切割'\r
\r
<div class="flex">\r
  <div class="circle circle1"></div>\r
</div>\r
\r
<style>\r
  .flex {\r
    display: flex;\r
    justify-content: space-evenly;\r
    flex-wrap: wrap;\r
    gap: 20px;\r
    align-items: center;\r
  }\r
\r
  /* 整体 */\r
  .circle {\r
    position: relative;\r
    font-size: 50px;\r
    width: 1em;\r
    height: 1em;\r
    border-radius: 50%;\r
    border: 0.15em solid #2a5e88;\r
    animation: clip 2s infinite linear;\r
  } \r
\r
  /* 个体1 */\r
  .circle1 {\r
  }\r
\r
  /* 动画 */\r
  @keyframes clip {\r
    0% {\r
      transform: rotate(0deg);\r
      clip-path: polygon(50% 50%,  100% 100%, 100% 50%, 100% 50%, 100% 50%, 100% 50%, 100% 50%);\r
    }\r
    14.3% {\r
      clip-path: polygon(50% 50%,  100% 100%, 100% 50%, 100% 0%, 100% 0%, 100% 0%, 100% 0%);\r
    }\r
    28.6% {\r
      clip-path: polygon(50% 50%,  100% 100%, 100% 50%, 100% 0%, 0% 0%, 0% 0%, 0% 0%);\r
    }\r
    42.6% {\r
      clip-path: polygon(50% 50%,  100% 100%, 100% 50%, 100% 0%, 0% 0%, 0% 100%, 0% 100%);\r
    }\r
    50% {\r
      transform: rotate(500deg);\r
      clip-path: polygon(50% 50%,  100% 100%, 100% 50%, 100% 0%, 0% 0%, 0% 100%, 50% 100%);\r
    }\r
    57.1% {\r
      clip-path: polygon(50% 50%,  100% 100%, 100% 50%, 100% 0%, 0% 0%, 0% 100%, 0% 100%);\r
    }\r
    71.4% {\r
      clip-path: polygon(50% 50%,  100% 100%, 100% 50%, 100% 0%, 0% 0%, 0% 0%, 0% 0%);\r
    }\r
    85.7% {\r
      clip-path: polygon(50% 50%,  100% 100%, 100% 50%, 100% 0%, 100% 0%, 100% 0%, 100% 0%);\r
    }\r
    100% {\r
      transform: rotate(720deg);\r
      clip-path: polygon(50% 50%,  100% 100%, 100% 50%, 100% 50%, 100% 50%, 100% 50%, 100% 50%);\r
    }\r
  }\r
</style>\r
\r
:::\r
\r
:::Dome title=多元素类圆 info='使用 animation steps 分步播放'\r
\r
<div class="flex">\r
  <div class="circle circle1">\r
    <div style="rotate: 0deg; opacity: 0.4" ></div>\r
    <div style="rotate: 30deg; opacity: 0.45" ></div>\r
    <div style="rotate: 60deg; opacity: 0.5" ></div>\r
    <div style="rotate: 90deg; opacity: 0.55" ></div>\r
    <div style="rotate: 120deg; opacity: 0.6" ></div>\r
    <div style="rotate: 150deg; opacity: 0.65" ></div>\r
    <div style="rotate: 180deg; opacity: 0.7" ></div>\r
    <div style="rotate: 210deg; opacity: 0.75" ></div>\r
    <div style="rotate: 240deg; opacity: 0.8" ></div>\r
    <div style="rotate: 270deg; opacity: 0.85" ></div>\r
    <div style="rotate: 300deg; opacity: 0.9" ></div>\r
    <div style="rotate: 330deg; opacity: 0.95" ></div>\r
  </div>\r
  <div class="circle circle2">\r
    <div style="rotate: 0deg; opacity: 0.3" ></div>\r
    <div style="rotate: 45deg; opacity: 0.4" ></div>\r
    <div style="rotate: 90deg; opacity: 0.5" ></div>\r
    <div style="rotate: 135deg; opacity: 0.6" ></div>\r
    <div style="rotate: 180deg; opacity: 0.7" ></div>\r
    <div style="rotate: 225deg; opacity: 0.8" ></div>\r
    <div style="rotate: 270deg; opacity: 0.9" ></div>\r
    <div style="rotate: 315deg; opacity: 1" ></div>\r
  </div>\r
</div>\r
\r
<style>\r
  .flex {\r
    display: flex;\r
    justify-content: space-evenly;\r
    flex-wrap: wrap;\r
    gap: 20px;\r
    align-items: center;\r
  }\r
\r
  /* 整体 */\r
  .circle {\r
    position: relative;\r
    font-size: 50px;\r
    width: 1em;\r
    height: 1em;\r
  }\r
  .circle > div {\r
    position: absolute;\r
    top: 0;\r
    background: #a8e;\r
    transform-origin: center 0.5em;\r
  }\r
\r
  /* 个体1 */\r
  .circle1 {\r
    animation: rotate 1s steps(12) 0s infinite;\r
  }\r
  .circle1 > div {\r
    left: calc(50% - 0.05em);\r
    height: 0.25em;\r
    width: 0.1em;\r
    border-radius: 1em;\r
  }\r
\r
  /* 个体2 */\r
  .circle2 {\r
    animation: rotate 1s steps(8) 0s infinite;\r
  }\r
  .circle2 > div {\r
    left: calc(50% - 0.1em);\r
    height: 0.2em;\r
    width: 0.2em;\r
    border-radius: 1em;\r
  }\r
\r
  /* 动画 */\r
  @keyframes rotate {\r
    0% {\r
      transform: rotate(0deg);\r
    }\r
    100% {\r
      transform: rotate(360deg);\r
    }\r
  }\r
</style>\r
\r
:::\r
`;export{r as default};
