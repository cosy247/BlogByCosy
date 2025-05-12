import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'BlogByCosy',
  description: 'BlogByCosy',
  srcDir: './docs',
  vite: {
    server: {
      port: 2470,
    },
  },
});
