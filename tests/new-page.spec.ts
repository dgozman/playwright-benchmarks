import { test, expect } from '@playwright/test';
import { reps } from '../common';

for (let i = 0; i < reps; i++) {
  test('new-page ' + i, async ({ page }) => {
    // do nothing, just create the page
  });
}

