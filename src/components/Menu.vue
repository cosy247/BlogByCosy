<template>
  <div class="Menu" :class="{ active: props.isShow }">
    <div class="menu-cates">
      <div class="menu-cate">标签</div>
      <div class="menu-cate">图集</div>
      <div class="menu-cate">独立应用</div>
    </div>
    <div class="menu-readme"></div>
  </div>
</template>

<script setup>
const props = defineProps(['isShow']);

const cates = [{}];
</script>

<style scoped>
.Menu {
  position: fixed;
  left: -150%;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: white;
  z-index: 800;
  transition: var(--menu-time);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10vw;
}
.Menu::after {
  content: '';
  position: absolute;
  display: block;
  left: 100%;
  top: 0;
  height: 100%;
  width: 50%;
  background: #9a8;
}
.Menu.active {
  left: 0;
}
.menu-cates {
  position: relative;
  font-size: 6vh;
  margin-left: 20vw;
}
.menu-cates:hover .menu-cate {
  opacity: 0.5;
}
.menu-cate {
	position: relative;
  padding: 0.2em 0;
  cursor: pointer;
  transition: 0.4s;
}
.menu-cate.menu-cate:hover {
	opacity: 1;
	letter-spacing: 0.2em;
}
.menu-cate::before {
	content: '';
  position: absolute;
  left: -0.4em;
  top: 0.3em;
  width: 0.15em;
  height: 1.2em;
  background: var(--theme-color);
  transition: inherit;
	opacity: 0;
}
.menu-cate:hover:before {
	opacity: 1;
}
</style>
