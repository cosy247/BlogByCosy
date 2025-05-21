<template>
  <div class="mdContent">
    <div v-html="result"></div>
  </div>
</template>

<script setup>
import MarkdownIt from 'markdown-it';
import { readmeData } from '../data';
import '../assets/styles/md.scss';
import { markRaw } from 'vue';

const md = new MarkdownIt();
const result = markRaw(readmeData);

// markRaw(readmeData);
</script>

<style scoped>
.Readme {
}
</style>
