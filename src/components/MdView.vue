<template>
  <div>
    <template v-for="(item, index) in renderContents">
      <component v-if="index % 2" :is="components[item.componentName]" :params="item.params" :data="item.data" />
      <div v-else class="mdContent" v-html="item"></div>
    </template>
  </div>
</template>

<script setup>
import '../styles/md.css';
import { defineAsyncComponent, ref, shallowRef } from 'vue';
import pageContent from '../utils/pageContent';
import renderMark from '../utils/renderMark.js';
import config from '../../config.js';

const emits = defineEmits(['load']);
const { fileName } = defineProps(['fileName']);

const components = shallowRef({});
const renderContents = ref([]);
if (pageContent[`/docs/${fileName}.md`]) {
  pageContent[`/docs/${fileName}.md`]().then(async (content) => {
    const regex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
    const mdContents = content.replace(regex, '').split(/(?<![:]):::(?![:])/);
    for (let index = 0; index < mdContents.length; index++) {
      let text = mdContents[index].trim();
      if (index % 2) {
        text = text.trim();
        const [first, ...datas] = text.split('\n');
        const data = datas.join('\n');
        const [componentName, ...paramStrings] = first.split(' ');
        const paramMatch = paramStrings.join(' ').match(/(\w+)\s*=\s*('[^']*'|"[^"]*"|[^\s]*)/g);
        const params = {};
        if (paramMatch) {
          paramMatch.forEach((p) => {
            const [key, value] = p.split('=');
            if (typeof value == 'string' && `'"`.includes(value[0])) {
              params[key] = value.slice(1, -1);
            } else {
              params[key] = value;
            }
          });
        }
        components.value[componentName] = defineAsyncComponent(() => import(`${config.componentDir}/${componentName}.vue`));
        renderContents.value.push({ componentName, params, data });
      } else {
        renderContents.value.push(await renderMark(text, fileName));
      }
    }
    emits('load');
  });
}
</script>
