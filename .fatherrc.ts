import { defineConfig } from 'father';

export default defineConfig({
  esm: {
    output: 'dist',
    overrides: {
      'src/core': {
        output: 'core',
      },
      'src/react': {
        output: 'react',
      },
      'src/server': {
        output: 'server',
      },
    },
  },
});
