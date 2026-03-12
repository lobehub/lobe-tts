import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

import { name } from './package.json';

export default defineConfig({
  test: {
    alias: {
      '@': resolve(__dirname, './src'),
      [name]: resolve(__dirname, './src'),
    },
    environment: 'jsdom',
    globals: true,
  },
});
