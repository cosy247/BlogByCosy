import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import preDocs from './plugins/preDocs';
import config from './config';

export default defineConfig({
  plugins: [vue(), preDocs()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 2470,
  },
  build: {
    outDir: config.outDir,
  }
});
