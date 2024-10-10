import { test, expect } from '@playwright/test';
import { reps } from '../common';

for (let i = 0; i < reps; i++) {
  test('launch-persistent ' + i, async ({ playwright, browserName }) => {
    const context = await playwright[browserName].launchPersistentContext('');
    await context.close();
  });
}
