import { defineConfig } from 'tsdown';

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    index: 'src/index.ts',
    react: 'src/react/index.ts',
    server: 'src/server/index.ts',
  },
  format: 'es',
  outDir: 'es',
  unbundle: true,
});
