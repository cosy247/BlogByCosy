<template>
  <div class="FloatingSpot">
    <div class="mask">
      <canvas class="canvas" ref="canvas"></canvas>
    </div>
    <div class="content">{{ props.text }}</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps(['text', 'color']);

const canvas = ref(null);

onMounted(() => {
  const ctx = canvas.value.getContext('2d');
  const sizeStyle = getComputedStyle(canvas.value);
  const height = parseInt(sizeStyle.height);
  const width = parseInt(sizeStyle.width);

  // 配置属性
  const circleSize = 1;
  const circleGap = 2;
  const color = props.color?.split(',').map(d => Number(d)) || [255, 200, 0, 0.5];
  const colorSpeed = 50;
  const opacitySpeed = 0.2;

  // 设置画布宽高
  canvas.value.height = height;
  canvas.value.width = width;

  // 生成随机颜色
  function getRandomColor(pColor) {
    return pColor.map((c, i) => {
      if (i == 3) {
        let result = c + Math.random() * opacitySpeed - opacitySpeed / 2;
        if (result > 1) return 1;
        if (result < 0) return 0;
        return result;
      } else {
        let result = c + Math.random() * colorSpeed - colorSpeed / 2;
        if (c > color[i]) {
          result -= colorSpeed / 10;
        } else {
          result += colorSpeed / 10;
        }
        if (result > 255) return 255;
        if (result < 0) return 0;
        return result;
      }
    });
  }

  // 生成颜色矩阵
  const colorMap = [];
  for (let x = circleSize + circleGap / 2; x < width; x += 2 * circleSize + circleGap) {
    const rows = [];
    colorMap.push(rows);
    for (let y = circleSize + circleGap / 2; y < height; y += 2 * circleSize + circleGap) {
      rows.push(getRandomColor(color));
    }
  }

  // 绘制
  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (let x = circleSize + circleGap / 2, i = 0; x < width; x += 2 * circleSize + circleGap, i++) {
      for (let y = circleSize + circleGap / 2, j = 0; y < height; y += 2 * circleSize + circleGap, j++) {
        ctx.beginPath(); //开始绘制
        ctx.arc(x, y, circleSize, 0, 2 * Math.PI); //arc 的意思是“弧”
        colorMap[i][j] = getRandomColor(colorMap[i][j]);
        ctx.fillStyle = `rgba(${colorMap[i][j].join(',')})`; //设置填充颜色
        ctx.fill(); //开始填充
      }
    }
    requestAnimationFrame(draw);
  }

  // 开始运行
  requestAnimationFrame(draw);
});
</script>

<style scoped>
.FloatingSpot {
  position: relative;
  height: 200px;
  width: 100%;
  border: 1px solid #09a;
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
}
.mask {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  transform: translate(-50%, -50%);
  transition: opacity 1s;
  opacity: 0;
}
.FloatingSpot:hover .mask {
  width: 100%;
  height: 100%;
  border-radius: 0%;
  opacity: 1;
  animation: mask 1s;
}
@keyframes mask {
  from {
    clip-path: circle(0%);
  }
  to {
    clip-path: circle(100%);
  }
}
.canvas {
  height: 100%;
  width: 100%;
  margin: auto;
}
.content {
  position: relative;
  margin: auto;
  font-size: 50px;
  z-index: 1;
  cursor: pointer;
  transition: 0.4s;
  font-weight: 900;
}
.FloatingSpot:hover .content {
  transform: scale(1.2);
}
</style>
