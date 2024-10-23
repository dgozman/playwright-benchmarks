import { defineConfig } from '@playwright/test';
import { executablePath, channel, headless, browserName } from './common';

export default defineConfig({
  reporter: [['./reporter.ts']],
  testDir: './tests',
  use: {
    browserName,
    launchOptions: { executablePath: executablePath(), channel: channel() },
    headless,
  },
  workers: 1,
});
