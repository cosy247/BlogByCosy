---
id: 1762934522799 # 文章id
date: 2025/11/12 16:02 # 时间
title: 计算 mars3d 中两点的朝向 # 文章标题
description: 计算 mars3d 中两点的朝向 # 文章描述
tag: 前端 Mars3d # 文章标签
archive: # 文章归档
# recommendations: { recommendations } # 相关推荐id
shadow: false # 是否隐藏
top: 0 # 是否zhi置顶，数字越大优先级越高
---

# 计算 mars3d 中两点的朝向

在 Mars3D 三维地图开发中，经常需要计算两点间的朝向（航向角 heading 和俯仰角 pitch），用于实现模型朝向目标点、相机自动对准目标等场景。

## 工具函数定义

```js title=calculateOrientation.js
/**
 * ENU局部坐标系（东=X，北=Y，天=Z）
 * @param {Array} start [经度(°), 纬度(°), 高度(m)] 起点坐标
 * @param {Array} end [经度(°), 纬度(°), 高度(m)] 终点坐标
 * @returns {Object} 朝向信息：heading(0-360°)、pitch(-90~90°)
 */
export default function (start, end) {
  const [lon1, lat1, alt1] = start;
  const [lon2, lat2, alt2] = end;

  // 1. 经纬度转弧度（数学计算需基于弧度制）
  const lon1Rad = (lon1 * Math.PI) / 180;
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lon2Rad = (lon2 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;

  // 2. 计算ENU坐标系下的三维偏移量
  const earthRadius = 6371000; // 地球平均半径（米）
  const dx = earthRadius * (lon2Rad - lon1Rad) * Math.cos(lat1Rad); // 东向偏移（X轴）
  const dy = earthRadius * (lat2Rad - lat1Rad); // 北向偏移（Y轴）
  const dz = alt2 - alt1; // 垂直方向偏移（Z轴，天向为正）

  // 处理特殊情况：起点和终点几乎重合
  const horizontalDist = Math.sqrt(dx ** 2 + dy ** 2);
  if (horizontalDist < 0.001 && dz === 0) {
    throw new Error('起点和目标点不能重合，请确保两点坐标存在有效差异');
  }

  // 3. 计算航向角（heading）：0-360°，顺时针递增
  let headingRad = Math.atan2(dx, dy); // 原始计算（0=正北）
  let heading = (headingRad * 180) / Math.PI;
  heading = (heading - 90) % 360; // 核心修正：转为常规地图坐标系（0=正东）
  heading = heading < 0 ? heading + 360 : heading; // 标准化到0-360°范围

  // 4. 计算俯仰角（pitch）：-90~90°，上仰为正、下俯为负
  let pitchRad = Math.atan2(dz, horizontalDist);
  let pitch = (pitchRad * 180) / Math.PI;

  // 保留两位小数，提升返回值可读性
  return {
    heading: Number(heading.toFixed(2)),
    pitch: Number(pitch.toFixed(2)),
  };
}
```

## 使用示例

创建时计算朝向：

```js
// 定义两点坐标（示例：北京某两点）
const startPoint = [116.39748, 39.90882, 50]; // 起点：经度、纬度、高度
const endPoint = [116.40748, 39.91882, 100]; // 终点：经度、纬度、高度

const modelEntity = new mars3d.graphic.ModelEntity({
  style: {
    ...calculateOrientation(startPoint, endPoint)
    url: './glb/model.glb',
    scale: 10,
    minimumPixelSize: 100,
  },
});
map.graphicLayer.addGraphic(modelEntity);
```

后续修改朝向：

```js
modelEntity.setStyle(calculateOrientation(startPoint, endPoint));
```
