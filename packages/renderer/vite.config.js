/* eslint-env node */

import { chrome } from '../../.electron-vendors.cache.json';
import { renderer } from 'unplugin-auto-expose';
import { join } from 'node:path';
import react from '@vitejs/plugin-react';
import { injectAppVersion } from '../../version/inject-app-version-plugin.mjs';

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, '../..');

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: PROJECT_ROOT,
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: false,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      input: join(PACKAGE_ROOT, 'index.html'),
      output: {
        manualChunks: {
          lodash: ['lodash'],
          allotment: ['allotment'],
          phylotree: ['@aqaurius6666/phylotree-visualization', 'phylotree'],
        },
      },
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  css: {
    modules: {
      scopeBehaviour: 'local',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
  plugins: [
    renderer.vite({
      preloadEntry: join(PACKAGE_ROOT, '../preload/src/index.ts'),
    }),
    injectAppVersion(),
    react(),
  ],
};

export default config;
