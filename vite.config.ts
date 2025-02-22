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
    watch: false,
    exclude: [
      'preact'
    ]
  }
});
