import appTools, { defineConfig } from '@modern-js/app-tools';

export default defineConfig({
  runtime: {
    state: true,
  },
  source: {
    enableAsyncEntry: true,
  },
  plugins: [appTools()],
});
