import { defineConfig } from '@playwright/test';
import fs from 'fs';

let executablePath = process.env.EXECUTABLE_PATH;

if (!executablePath && process.env.READ_EXECUTABLE_PATH_FROM) {
  const contents = fs.readFileSync(process.env.READ_EXECUTABLE_PATH_FROM, 'utf8');
  const [, ...parts] = contents.split('\n')[0].split(' ');
  process.env.EXECUTABLE_PATH = executablePath = parts.join(' ');
}

export default defineConfig({
  reporter: [['./reporter.ts']],
  testDir: './tests',
  use: {
    browserName: (process.env.BROWSER_NAME as any) || 'chromium',
    launchOptions: {
      executablePath: executablePath || undefined,
    },
    headless: process.env.HEADED ? false : true,
  },
  workers: 1,
});
