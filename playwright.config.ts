import { defineConfig } from '@playwright/test';
import { executablePath, headless, browserName } from './common';

export default defineConfig({
  reporter: [['./reporter.ts']],
  testDir: './tests',
  use: {
    browserName,
    launchOptions: { executablePath: executablePath() },
    headless,
  },
  workers: 1,
});
