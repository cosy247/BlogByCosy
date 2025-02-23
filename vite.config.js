import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import preDocs from './src/plugins/preDocs';
import config from './config';
import viteBuildCopy from './src/plugins/viteBuildCopy';

export default defineConfig({
  plugins: [
    vue(),
    preDocs(),
    viteBuildCopy([
      ['./assets', `${config.outDir}/assets`],
      ['./docs/assets', `${config.outDir}/docs/assets`],
    ]),
  ],
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
    assetsDir: 'public',
  },
});
