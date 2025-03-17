import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  build: {
    outDir: 'build',
    lib: {
      name: 'build/index.js',
      entry: 'src/index.tsx',
    },
  },
  resolve: {
    alias: [
      { find: '@app', replacement: path.resolve(__dirname, 'src') },
    ],
  },
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    watch: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['build/**'],
    },
  },
});
