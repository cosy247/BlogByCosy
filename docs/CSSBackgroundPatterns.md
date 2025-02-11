---
id: 1739258073953 # 文章id
title: CSS 背景实现条纹，栅格，圆点等背景 # 文章标题
description: CSS 背景实现条纹，栅格，圆点等背景 # 文章描述
tags: CSS # 文章标签
archive: # 文章归档
recommendations: # 相关推荐id
shadow: false # 是否隐藏
top: 0 # 是否zhi置顶，数字越大优先级越高
---

# CSS 背景实现条纹，栅格，圆点等背景

对于一些规则，简单的平铺背景，可以尝试使用 `background` 属性进行绘制。

通常是先绘制最小单位后，通过循环方式来达到平铺的效果。

## 条纹背景

使用 [repeating-linear-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/repeating-linear-gradient) 重复线性渐变绘制基础条纹，当颜色渐变节点相同时会直接进行颜色切换（没有空间进行过渡），实现颜色条拼接的效果：

:::Dome

<div class="background"></div>

<style>
  .background {
    height: 100px;
    width: 100%;
    background: repeating-linear-gradient(
      45deg, /* 90度表示水平方向 */ 
      #f70a8dea, /* 第一种颜色 */ 
      #f70a8dea 10px, /* 第一种颜色的宽度 */ 
      #0366d6ea 10px, /* 第二种颜色 */ 
      #0366d6ea 20px /* 第二种颜色的宽度 */
    );
  }
</style>

:::

> 背景会默认循环

## 栅格背景

与条纹背景类似，使用 [linear-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/linear-gradient) 线性渐变。 主要区别是渐变是宽度的控制：

:::Dome

<div class="background"></div>

<style>
  .background {
    height: 100px;
    width: 100%;
    background: linear-gradient(90deg, #8a7 1px, transparent 1px) 5px/15px 15px,
                linear-gradient(0deg, #8a7 1px, transparent 1px) 5px/15px 15px;
  }
</style>

:::

其中 background 属性展开如下：

```css
css {
  background-image: linear-gradient(90deg, #8a7 1px, transparent 1px), linear-gradient(0deg, #8a7 1px, transparent 1px);
  background-position-x: 5px, 5px;
  background-position-y: center, center;
  background-size: 15px 15px, 15px 15px;
}
```

绘制了两个方向的线，每个属性逗号分隔开一一对应。其中 `background-size` 属性表示了单元格的大小，`background-position` 属性从什么地方开始绘制。

## 圆点背景

单个圆点通过径向渐变 [radial-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/radial-gradient) 实现，再结合背景的复制进行平铺。

:::Dome

<div class="background"></div>

<style>
  .background {
    height: 100px;
    width: 100%;
    background: radial-gradient(#8a7 45%, transparent 50%) 0px/20px 20px;
  }
</style>

:::

> > 如果设置 `radial-gradient(#8a7 50%, transparent 50%)`，得到的圆形往往不理想。给第一个颜色设置 45% 的位置，留下 5% 来过渡会得到比较理想的圆形。

## 其他背景

:::Dome title=点阵背景

<div class="background"></div>

<style>
  .background {
    height: 100px;
    width: 100%;
    filter: con;
    background: linear-gradient(45deg, #eee 25%, #0000 25%, #0000 75%, #eee 75%) 0 0/31px 31px,
                linear-gradient(45deg, #eee 25%, #0000 25%, #0000 75%, #eee 75%) 15px 15px/31px 31px;
  }
</style>

:::

:::Dome title=你好

<div class="background"></div>

<style>
  .background {
    height: 100px;
    width: 100%;
    filter: con;
    background: linear-gradient(#000 0, #a328 0) 10% 10%/40% 20% no-repeat,
                linear-gradient(#000 0, #2e28 0) 90% 10%/30% 30% no-repeat,
                linear-gradient(#000 0, #22e8 0) 50% 50%/10% 70% no-repeat,
                linear-gradient(#000 0, #2e28 0) 50% 100%/20% 10% no-repeat;
  }
</style>

:::
