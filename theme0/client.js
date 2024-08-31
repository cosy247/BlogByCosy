import { defineClientConfig } from '@vuepress/client';
import Layout from './Layout.vue';
import NotFound from './NotFound.vue';

export default defineClientConfig({
  layouts: {
    Layout,
    NotFound,
  },
  enhance: ({ app }) => {},
});
