import { defineConfig } from '@lobehub/lint';
import { restrictedImports } from '@lobehub/ui/eslint';

export default defineConfig(
  {
    ignores: [
      '**/node_modules',
      '**/coverage',
      '**/.coverage',
      '**/jest*',
      '**/_test_',
      '**/__test__',
      '**/*.test.ts',
      '**/.react-router',
      '**/dist',
      '**/es',
      '**/logs',
      '**/.next',
    ],
    react: true,
  },
  restrictedImports,
  {
    rules: {
      'no-param-reassign': 0,
    },
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
    rules: {
      'unicorn/no-anonymous-default-export': 'off',
      'unicorn/no-array-callback-reference': 0,
      'unicorn/no-array-for-each': 0,
      'unicorn/no-useless-undefined': 0,
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
);
