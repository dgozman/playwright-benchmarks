import { test, expect } from '@playwright/test';
import { reps } from '../common';

for (let i = 0; i < reps; i++) {
  test('launch ' + i, async ({ playwright, browserName }) => {
    const browser = await playwright[browserName].launch();
    await browser.close();
  });
}
