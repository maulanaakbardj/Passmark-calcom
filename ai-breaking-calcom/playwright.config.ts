import { defineConfig } from '@playwright/test';

export default defineConfig({

  testDir: './tests',

  timeout: 120000,

  reporter: [
    ['html'],
    ['list']
  ],

  use: {

    headless: false,

    screenshot: 'on',

    trace: 'on',

    video: 'retain-on-failure'
  }
});