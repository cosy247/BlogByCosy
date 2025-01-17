<template>
  <div class="FloatingSpot">
    <canvas class="canvas" ref="canvas" width="100" height="100"></canvas>
    <div class="mask"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const canvas = ref(null);
onMounted(() => {
  const ctx = canvas.value.getContext('2d');
  const size = 100;
  const circleSize = 2;
  const color = [172, 42, 214, 0.5];
  const colorSpeed = 10;
  const opacitySpeed = 0.06;
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
  //3.绘制
  const colorMap = [];
  for (let x = circleSize + 1; x < size; x += 2 * circleSize + 1) {
    const rows = [];
    colorMap.push(rows);
    for (let y = circleSize + 1; y < size; y += 2 * circleSize + 1) {
      rows.push(getRandomColor(color));
    }
  }
  function draw() {
    ctx.clearRect(0, 0, size, size);
    for (let x = circleSize + 1, i = 0; x < size; x += 2 * circleSize + 1, i++) {
      for (let y = circleSize + 1, j = 0; y < size; y += 2 * circleSize + 1, j++) {
        ctx.beginPath(); //开始绘制
        ctx.arc(x, y, circleSize, 0, 2 * Math.PI); //arc 的意思是“弧”
        colorMap[i][j] = getRandomColor(colorMap[i][j]);
        ctx.fillStyle = `rgba(${colorMap[i][j]})`; //设置填充颜色
        ctx.fill(); //开始填充
      }
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
});
</script>

<style scoped>
.mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: white;
}
.mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: white;
}
.FloatingSpot {
  position: relative;
}
.canvas {
  border: 1px solid #09a;
  box-sizing: border-box;
}
.circles {
  width: 100px;
  height: 100px;
  display: grid;
  grid: repeat(10, 1fr) / repeat(10, 1fr);
}
.circle {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background: #8a78;
  animation: circle 5s infinite linear;
}
@keyframes circle {
  0% {
    filter: hue-rotate(0deg);
  }
  33% {
    filter: hue-rotate(40deg);
    opacity: 0.2;
  }
  50% {
    filter: hue-rotate(0deg);
    opacity: 0.2;
  }
  66% {
    filter: hue-rotate(-40deg);
    opacity: 0.2;
  }
  100% {
    filter: hue-rotate(0deg);
  }
}
</style>
