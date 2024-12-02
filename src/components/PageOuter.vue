<template>
  <div class="PageOuter" :class="{ out: showOut }">
    <div class="menu" @click="shiftMenu">
      <div class="menu-left" :class="{ active: isShowMenu }">&#xeb6d;</div>
      <div class="menu-text">MENU</div>
      <div class="menu-right" :class="{ active: !isShowMenu }">&#xeb6d;</div>
    </div>
    <div class="logo">
      C
      <img src="../assets/logo.png" alt="" />
      SY
      <span class="theme-color">2</span>
      47
    </div>
    <div class="links">
      <div class="link" v-for="link in links">
        <span class="link-icon" v-html="link.icon"></span>
        <span class="link-name">{{ link.name }}</span>
      </div>
      相关链接
      <span class="link-mark theme-color">/</span>
    </div>
    <div class="infos">
      <div class="info-see">
        访客数
        <span class="info-mark theme-color">/</span>
        {{ seeNumber }}
      </div>
    </div>
    <div class="date">
      {{ new Date().toLocaleDateString() }}
    </div>
  </div>
  <Menu :isShow="isShowMenu" />
</template>

<script setup>
import { computed, ref } from 'vue';
import Menu from './Menu.vue';

const links = [
  { icon: '&#xe600;', name: '邮箱', href: '' },
  { icon: '&#xe673;', name: 'github', href: '' },
  { icon: '&#xe603;', name: '哔哩哔哩', href: '' },
];

const showOut = ref(false);

const isShowMenu = ref(false);
function shiftMenu() {
  showOut.value = isShowMenu.value = !isShowMenu.value;
}

const seeNumber = ref(10);
</script>

<style scoped>
.PageOuter {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 900;
  transition: var(--menu-time);
  pointer-events: none;
}
.PageOuter.out {
  transform: scale(1.1);
}
.menu {
  position: absolute;
  left: 10vw;
  top: 10vh;
  font-size: 25px;
  font-weight: 900;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  pointer-events: auto;
}
.menu-left {
  transition: 0.5s;
  transform: rotate(-90deg);
  opacity: 0;
  margin-left: 0px;
  font-size: 0px;
}
.menu-left.active {
  opacity: 1;
  margin-right: 2px;
  font-size: 0.7em;
}
.menu-text::first-letter {
  color: var(--theme-color);
}
.menu-right {
  font-size: 0.7em;
  transition: 0.5s;
  transform: rotate(90deg);
  opacity: 0;
  margin-left: 0px;
  font-size: 0px;
}
.menu-right.active {
  opacity: 1;
  margin-left: 2px;
  font-size: 0.7em;
}
.logo {
  position: absolute;
  right: 10vw;
  top: 10vh;
  text-align: right;
  display: flex;
  align-items: center;
  font-size: 25px;
  font-weight: 900;
  user-select: none;
  pointer-events: auto;
}
.logo img {
  height: 1.2em;
  margin: 0 0.1em;
}
.links {
  position: absolute;
  bottom: 10vh;
  left: 10vw;
  font-size: 16px;
  user-select: none;
  pointer-events: auto;
}
.link {
  cursor: pointer;
  margin: 2px 0;
}
.link:hover {
  letter-spacing: 0.1em;
}
.link-icon {
  margin-right: 5px;
}
.link-name {
  opacity: 0;
  transition: 0.2s;
}
.link-name:first-letter {
  color: var(--theme-color);
}
.link:hover .link-name {
  opacity: 1;
}
.link-mark {
  font-weight: 900;
}
.infos {
  position: absolute;
  bottom: 10vh;
  right: 10vw;
  display: flex;
  flex-direction: column;
  align-items: end;
  font-size: 16px;
  pointer-events: auto;
}
.info-mark {
  color: var(--theme-color);
  font-weight: 900;
}
.date {
  position: absolute;
  right: 10vw;
  top: 50%;
  transform: translateY(-50%);
  writing-mode: vertical-lr;
  letter-spacing: 0.4em;
  display: flex;
  align-items: center;
  font-size: 13px;
  text-indent: 0.4em;
}
.date::after,
.date::before {
  content: '';
  display: block;
  width: 1px;
  height: 20vh;
  background: #8888;
  margin: 1em 0.5em;
}
</style>
