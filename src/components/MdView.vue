<template>
  <div class="mdContent" v-html="markdown"></div>
</template>

<script setup>
import '../styles/md.css';
import { ref } from 'vue';
import pageContent from '../utils/pageContent';
import 'highlight.js/styles/atom-one-dark.css';
import renderMark from '../utils/renderMark.js';

const emits = defineEmits(['load'])

const markdown = ref('');
const { fileName } = defineProps(['fileName']);
if (pageContent[`/docs/${fileName}.md`]) {
  pageContent[`/docs/${fileName}.md`]().then(async (content) => {
    const regex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
    markdown.value = await renderMark(content.replace(regex, ''), fileName);
    emits('load');
  });
}
</script>
