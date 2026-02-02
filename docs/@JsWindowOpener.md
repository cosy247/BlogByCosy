---
id: 1767865506398 # 文章id
date: 2026/1/8 17:45 # 时间
title: JS 弹窗管理(window.open) # 文章标题
description: JS 弹窗管理(window.open) # 文章描述
tag: 前端,JS # 文章标签
archive: # 文章归档
# recommendations: { recommendations } # 相关推荐id
shadow: false # 是否隐藏
top: 0 # 是否zhi置顶，数字越大优先级越高
---

# JS 弹窗管理(window.open)

在 web 前端，可以通过 `window.open()` 创建弹窗并 对弹窗进行管理通信。

## window.open() 基本语法

```javascript
open();
// url: 资源的 URL 或路径
open(url);
// target: 加载资源的浏览上下文的名称，也可以是 _self、_blank、_parent 和 _top
open(url, target);
// windowFeatures: 窗口特性列表，形式为 name=value
open(url, target, windowFeatures);
```

> 设置了 windowFeatures 值并且 target 不为 \_sel、\_parent 和 \_top 时创建独立弹窗。

> > 以下只讨论独立弹窗的情况下。

其中 windowFeatures 属性如下：

| 属性名             | 属性值 | 说明                                               |
| ------------------ | ------ | -------------------------------------------------- |
| popup              | 任意   | 是否使用最小弹出窗口                               |
| width/innerWidth   | number | 内容区域宽度，最小为 100                           |
| height/innerHeight | number | 内容区域高度，最小为 100                           |
| left/screenX       | number | 窗口生成位置的距离，像素为单位                     |
| top/screenY        | number | 窗口生成位置的距离，像素为单位                     |
| noopener           | 任意   | 新窗口将无法通过 Window.opener 访问原窗口          |
| noreferrer         | 任意   | 浏览器将省略 Referer 标头，并将 noopener 设为 true |

示例代码：

```js
window.open('https://cosy247.top/', '_blank', 'width=500,height=500,left=200,top=50');
```

## 关闭弹窗，判断是否关闭

`window.open()` 方法会返回一个[WindowProxy 窗口代理对象](https://developer.mozilla.org/zh-CN/docs/Glossary/WindowProxy)。可以通过 `WindowProxy.closed` 属性判断是否关闭。

```js
const newWindow = window.open('https://cosy247.top/', '_blank', 'width=500,height=500,left=200,top=50');
console.log(newWindow.closed); // false

// 关闭弹窗
newWindow.close();
console.log(newWindow.closed); // true
```

## 通信

### 通过 opener

在没有设置 `noopener` 时，在子窗口中可以通过 `window.opener` 访问到父窗口 `window`。

## 参考

1. [Window：open() 方法 - Web API | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/open)
1. [WindowProxy - MDN Web 文档术语表：Web 相关术语的定义 | MDN](https://developer.mozilla.org/zh-CN/docs/Glossary/WindowProxy)
