import { defineConfig } from 'father';

export default defineConfig({
  esm: { output: 'es' },
  cjs: { output: 'lib', platform: 'browser' },
});
