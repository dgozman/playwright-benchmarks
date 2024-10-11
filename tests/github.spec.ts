import { test, expect } from '@playwright/test';
import { reps } from '../common';

for (let i = 0; i < reps; i++) {
  test('github ' + i, async ({ page }) => {
    await page.goto('https://github.com/microsoft/playwright.dev');
    await page.getByRole('link', { name: '.gitignore, (File)' }).click();
    await page.getByTestId('latest-commit-html').getByRole('link', { name: '#1083' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('chore: update to Docusaurus v3 #1083');
    await page.getByRole('button', { name: 'edited' }).click();
    await page.getByRole('menuitem', { name: '@mxschmitt mxschmitt created' }).click();
    await expect(page.getByRole('article')).toContainText('Build is red, since it requires our stable release to have the </> fix applied.');
  });
}
