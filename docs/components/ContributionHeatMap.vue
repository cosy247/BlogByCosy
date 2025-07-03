<template>
  <div class="ContributionHeatMap">
    <template v-for="items in grids">
      <div v-for="item in items" :class="item?.className" :title="item?.title" :style="{ background: item?.color }">
        {{ item?.content }}
      </div>
    </template>
    <select v-model="year">
      <option v-for="year in Object.keys(dateMap)" :value="Number(year)">{{ year }}</option>
    </select>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { data as postsData } from '../../theme/data/posts.data';

const dateMap = {};
postsData.forEach((d) => {
  const dateString = d?.frontmatter?.date;
  if (!dateString) return;
  const dayDate = new Date(dateString);
  const year = dayDate.getFullYear();
  const month = dayDate.getMonth() + 1;
  const date = dayDate.getDate();
  if (!dateMap[year]) dateMap[year] = {};
  if (!dateMap[year][month]) dateMap[year][month] = {};
  if (!dateMap[year][month][date]) dateMap[year][month][date] = 0;
  dateMap[year][month][date]++;
});

const levelColors = ['#eff2f5', '#0366d666', '#0366d699', '#0366d6'];
const year = ref(2025);
const grids = computed(() => {
  const grids = Array(8).fill(1);
  grids.forEach((_, i) => (grids[i] = Array(54)));
  grids[2][0] = { content: '周二' };
  grids[6][0] = { content: '周六' };
  let dayDate = new Date(String(year.value));
  let dayX = 1;
  console.log(dayDate.getFullYear(), year.value);

  while (dayDate.getFullYear() === year.value) {
    const month = dayDate.getMonth() + 1;
    const date = dayDate.getDate();
    const day = dayDate.getDay() + 1;
    dayDate = new Date(dayDate.setHours(24));
    const level = Math.min(3, dateMap[year.value]?.[month]?.[date] || 0);
    grids[day][dayX] = {
      title: `${dayDate.toLocaleDateString()} : ${level}`,
      month,
      date,
      day,
      className: `grid-item`,
      color: levelColors[level],
    };
    if (date === 1) {
      grids[0][dayX] = { content: month };
    }
    if (day === 7) dayX++;
  }
  return grids;
});
</script>

<style scoped>
.ContributionHeatMap {
  margin: auto;
  display: grid;
  grid: repeat(8, 11px) / 25px repeat(53, 11px);
  gap: 2px;
  white-space: nowrap;
  line-height: 10px;
  font-size: 12px;
  text-align: center;
}
.grid-item {
  height: 100%;
  width: 100%;
  border-radius: 3px;
  border: 1px solid #eee8;
  box-sizing: border-box;
  cursor: pointer;
}
.level0 {
  background: #8888;
}
</style>
