---
id: 1738983236754 # 文章id
date: 2025/02/10 17:57
title: CSS 旋转加载动画 # 文章标题
description: CSS 旋转加载动画 # 文章描述
tag: CSS 前端 # 文章标签
archive: # 文章归档
recommendations: # 相关推荐id
shadow: false # 是否隐藏
top: 0 # 是否zhi置顶，数字越大优先级越高
---

# CSS 旋转加载动画

:::Dome title=基础旋转 info='使用 border 画圆'

<div class="flex">
  <div class="circle circle1"></div>
  <div class="circle circle2"></div>
  <div class="circle circle3"></div>
</div>

<style>
  .flex {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
  }

  /* 整体 */
  .circle {
    font-size: 50px;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    border: 0.15em solid #2a5e88;
    animation: rotate 1s infinite linear;
  }

  /* 个体1 */
  .circle1 {
    border-left-color: transparent;
  }
  
  /* 个体2 */
  .circle2 {
    border-left-color: transparent;
    border-right-color: transparent;
  }
  
  /* 个体3 */
  .circle3 {
    border-left-color: #2a5e8833;
    border-right-color: #2a5e8833;
  }

  /* 动画 */
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>

:::

:::Dome title=多层旋转 info='使用 after before 伪元素'

<div class="flex">
  <div class="circle circle1"></div>
  <div class="circle circle2"></div>
</div>

<style>
  .flex {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
  }

  /* 整体 */
  .circle {
    position: relative;
    font-size: 50px;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    border: 0.1em solid #2a5e88;
    animation: rotate 1s infinite linear;
  }
  .circle::before {
    content: '';
    position: absolute;
    width: 1.3em;
    height: 1.3em;
    left: -0.25em;
    top: -0.25em;
    border-radius: 50%;
    border: 0.1em solid #2a5e88;
  }
  .circle::after {
    content: '';
    position: absolute;
    width: 0.7em;
    height: 0.7em;
    left: 0.05em;
    top: 0.05em;
    border-radius: 50%;
    border: 0.1em solid #2a5e88;
  }

  /* 个体1 */
  .circle1 {
    border-left-color: transparent;
    border-right-color: transparent;
  }
  .circle1::before {
    border-color: #a87;
    border-left-color: transparent;
    border-right-color: transparent;
    animation: rotate 2s infinite linear reverse;
  }
  .circle1::after {
    border-color: #8a7;
    border-left-color: transparent;
    border-right-color: transparent;
    animation: rotate 3s infinite linear;
  }
  
  /* 个体2 */
  .circle2 {
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
  }
  .circle2::before {
    border-color: #a87;
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
    animation: rotate 2s infinite linear reverse;
  }
  .circle2::after {
    border-color: #8a7;
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
    animation: rotate 2s infinite linear;
  }
  
  /* 动画 */
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>

:::

:::Dome title=动态旋转 info='使用 clip-path 进行切割'

<div class="flex">
  <div class="circle circle1"></div>
</div>

<style>
  .flex {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
  }

  /* 整体 */
  .circle {
    position: relative;
    font-size: 50px;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    border: 0.15em solid #2a5e88;
    animation: clip 2s infinite linear;
  } 

  /* 个体1 */
  .circle1 {
  }

  /* 动画 */
  @keyframes clip {
    0% {
      transform: rotate(0deg);
      clip-path: polygon(50% 50%,  100% 100%, 100% 50%, 100% 50%, 100% 50%, 100% 50%, 100% 50%);
    }
    14.3% {
      clip-path: polygon(50% 50%,  100% 100%, 100% 50%, 100% 0%, 100% 0%, 100% 0%, 100% 0%);
    }
    28.6% {
      clip-path: polygon(50% 50%,  100% 100%, 100% 50%, 100% 0%, 0% 0%, 0% 0%, 0% 0%);
    }
    42.6% {
      clip-path: polygon(50% 50%,  100% 100%, 100% 50%, 100% 0%, 0% 0%, 0% 100%, 0% 100%);
    }
    50% {
      transform: rotate(500deg);
      clip-path: polygon(50% 50%,  100% 100%, 100% 50%, 100% 0%, 0% 0%, 0% 100%, 50% 100%);
    }
    57.1% {
      clip-path: polygon(50% 50%,  100% 100%, 100% 50%, 100% 0%, 0% 0%, 0% 100%, 0% 100%);
    }
    71.4% {
      clip-path: polygon(50% 50%,  100% 100%, 100% 50%, 100% 0%, 0% 0%, 0% 0%, 0% 0%);
    }
    85.7% {
      clip-path: polygon(50% 50%,  100% 100%, 100% 50%, 100% 0%, 100% 0%, 100% 0%, 100% 0%);
    }
    100% {
      transform: rotate(720deg);
      clip-path: polygon(50% 50%,  100% 100%, 100% 50%, 100% 50%, 100% 50%, 100% 50%, 100% 50%);
    }
  }
</style>

:::

:::Dome title=多元素类圆 info='使用 animation steps 分步播放'

<div class="flex">
  <div class="circle circle1">
    <div style="rotate: 0deg; opacity: 0.4" ></div>
    <div style="rotate: 30deg; opacity: 0.45" ></div>
    <div style="rotate: 60deg; opacity: 0.5" ></div>
    <div style="rotate: 90deg; opacity: 0.55" ></div>
    <div style="rotate: 120deg; opacity: 0.6" ></div>
    <div style="rotate: 150deg; opacity: 0.65" ></div>
    <div style="rotate: 180deg; opacity: 0.7" ></div>
    <div style="rotate: 210deg; opacity: 0.75" ></div>
    <div style="rotate: 240deg; opacity: 0.8" ></div>
    <div style="rotate: 270deg; opacity: 0.85" ></div>
    <div style="rotate: 300deg; opacity: 0.9" ></div>
    <div style="rotate: 330deg; opacity: 0.95" ></div>
  </div>
  <div class="circle circle2">
    <div style="rotate: 0deg; opacity: 0.3" ></div>
    <div style="rotate: 45deg; opacity: 0.4" ></div>
    <div style="rotate: 90deg; opacity: 0.5" ></div>
    <div style="rotate: 135deg; opacity: 0.6" ></div>
    <div style="rotate: 180deg; opacity: 0.7" ></div>
    <div style="rotate: 225deg; opacity: 0.8" ></div>
    <div style="rotate: 270deg; opacity: 0.9" ></div>
    <div style="rotate: 315deg; opacity: 1" ></div>
  </div>
</div>

<style>
  .flex {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
  }

  /* 整体 */
  .circle {
    position: relative;
    font-size: 50px;
    width: 1em;
    height: 1em;
  }
  .circle > div {
    position: absolute;
    top: 0;
    background: #a8e;
    transform-origin: center 0.5em;
  }

  /* 个体1 */
  .circle1 {
    animation: rotate 1s steps(12) 0s infinite;
  }
  .circle1 > div {
    left: calc(50% - 0.05em);
    height: 0.25em;
    width: 0.1em;
    border-radius: 1em;
  }

  /* 个体2 */
  .circle2 {
    animation: rotate 1s steps(8) 0s infinite;
  }
  .circle2 > div {
    left: calc(50% - 0.1em);
    height: 0.2em;
    width: 0.2em;
    border-radius: 1em;
  }

  /* 动画 */
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>

:::
