---
id: 1766372359156 # 文章id
date: 2025/12/22 10:59 # 时间
title: mars3d 自定义地图右键菜单 # 文章标题
description: mars3d 自定义地图右键菜单 # 文章描述
tag: 前端 Mars3d # 文章标签
archive: # 文章归档
# recommendations: { recommendations } # 相关推荐id
shadow: false # 是否隐藏
top: 0 # 是否zhi置顶，数字越大优先级越高
---

# mars3d 自定义地图右键菜单

在 mars3d 中，可以通过 `bindContextMenu` 方法为地图绑定自定义右键菜单，也可以结合默认右键菜单实现混合菜单效果。

## 核心原理

mars3d 的 `map`（地图实例）提供了 `bindContextMenu` 方法如下：

![alt text](assets/@Mars3dContextMenu/image.png)

同时，`getDefaultContextMenu` 方法可以获取地图默认的右键菜单配置数组：

## 纯自定义右键菜单

通过 `bindContextMenu` 直接传入自定义菜单项数组，替换默认右键菜单。

```javascript
// 假设 map 是已初始化的 mars3d 地图实例
map.bindContextMenu([
  {
    text: '获取位置信息',
    icon: '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3416" width="20" height="20"><path d="M512 64C306.4 64 140 230.4 140 436c0 101.6 40.8 194.4 107.2 261.6L512 960l264-263.2c66.4-67.2 107.2-159.2 107.2-261.6C884 230.4 717.6 64 512 64z m128 331.2c-4.8 62.4-54.4 112-116.8 116.8-75.2 6.4-138.4-53.6-138.4-127.2 0-70.4 57.6-128 128-128 73.6 0 133.6 63.2 127.2 138.4z" fill="#fff"></path></svg>',
    show: true, // 是否显示该菜单项（可动态控制，如根据场景显示/隐藏）
    callback: (e) => {
      // 菜单项点击后的回调函数
      // e.cartesian 是右键点击位置的笛卡尔坐标，转换为经纬度高程点
      const mpt = mars3d.LngLatPoint.fromCartesian(e.cartesian);
      console.log('点击位置的经纬度高程：', mpt); // 输出：{lng: 经度, lat: 纬度, alt: 高程}
    },
  },
  // 可添加多个自定义菜单项
  {
    text: '测量距离',
    icon: 'fa fa-ruler',
    show: true,
    callback: (e) => {
      // 此处可编写测量距离的逻辑
      alert('开始测量距离');
    },
  },
]);
```

## 结合默认右键菜单

使用 `getDefaultContextMenu` 获取默认菜单配置，传入需要保留的菜单项。

```javascript
// 保留默认菜单的前3项，再添加自定义菜单项
mapObj.bindContextMenu([
  // 解构默认菜单的前3项（slice(0, 3) 表示取数组前3个元素）
  ...mapObj.getDefaultContextMenu().slice(0, 3),
  // 自定义菜单项
  {
    text: '获取位置信息',
    icon: '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3416" width="20" height="20"><path d="M512 64C306.4 64 140 230.4 140 436c0 101.6 40.8 194.4 107.2 261.6L512 960l264-263.2c66.4-67.2 107.2-159.2 107.2-261.6C884 230.4 717.6 64 512 64z m128 331.2c-4.8 62.4-54.4 112-116.8 116.8-75.2 6.4-138.4-53.6-138.4-127.2 0-70.4 57.6-128 128-128 73.6 0 133.6 63.2 127.2 138.4z" fill="#fff"></path></svg>',
    show: true, // 是否显示该菜单项（可动态控制，如根据场景显示/隐藏）
    callback: (e) => {
      // 菜单项点击后的回调函数
      // e.cartesian 是右键点击位置的笛卡尔坐标，转换为经纬度高程点
      const mpt = mars3d.LngLatPoint.fromCartesian(e.cartesian);
      console.log('点击位置的经纬度高程：', mpt); // 输出：{lng: 经度, lat: 纬度, alt: 高程}
    },
  },
  // 可添加多个自定义菜单项
  {
    text: '测量距离',
    icon: 'fa fa-ruler',
    show: true,
    callback: (e) => {
      // 此处可编写测量距离的逻辑
      alert('开始测量距离');
    },
  },
]);
```

![alt text](assets/@Mars3dContextMenu/image-3.png)

## 动态控制菜单项显示

菜单项的 `show` 配置支持动态控制，例如根据右键点击的位置（如是否在某个图层上）显示或隐藏菜单项。

```javascript
mapObj.bindContextMenu([
  {
    text: '编辑该要素',
    // 动态判断是否显示：此处示例为“仅当右键点击在矢量图层上时显示”
    show: (e) => {
      const layer = mapObj.getLayerByClassName('VectorLayer'); // 获取矢量图层
      return layer && layer.contains(e.cartesian); // 判断点击位置是否在图层上
    },
    callback: (e) => {
      // 编辑要素的逻辑
    },
  },
]);
```

## 参考

1. [Map - V3.10.10 - Mars3D API 文档](http://mars3d.cn/api/Map.html)
