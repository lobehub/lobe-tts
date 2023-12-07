import { defineConfig } from 'father';

export default defineConfig({
  cjs: {
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
