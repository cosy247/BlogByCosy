<template>
  <div class="PageOuter">
    <div class="copyright">cosy247</div>
  </div>
  <Menu />
</template>

<script setup>
import Menu from './Menu.vue';
</script>

<style>
body {
  overflow-y: scroll;
  padding: calc(60px + var(--outer-width)) 0 0 var(--outer-width);
  box-sizing: border-box;
}

body::-webkit-scrollbar {
  width: var(--outer-width);
  background: #1a232c;
  padding: 0px 0;
  margin: 0px 0;
}
</style>

<style scoped>
.PageOuter {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 600;
  border: var(--outer-width) solid #1a232c;
  box-sizing: border-box;
  pointer-events: none;
}

.PageOuter::before {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  outline: var(--outer-width) solid #1a232c;
  z-index: 600;
  pointer-events: none;
  border-radius: var(--outer-width);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

::v-deep(.PageOuter *) {
  pointer-events: auto;
}

.copyright {
  position: absolute;
  top: 100%;
  left: 50%;
  background: #125fd388;
  border-radius: 10px;
  transform: translateX(-50%) scale(0.7);
  font-size: var(--outer-width);
  line-height: var(--outer-width);
  padding: 0px 10px;
  color: rgba(214, 214, 214, 0.833);
  transform-origin: center center;
}
</style>
