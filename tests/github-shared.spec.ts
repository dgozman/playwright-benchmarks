import { type Page, test, expect } from '@playwright/test';
import { reps } from '../common';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});

for (let i = 0; i < reps; i++) {
  test('github-shared ' + i, async ({}) => {
    await page.goto('https://github.com/microsoft/playwright.dev');
    await page.getByRole('link', { name: '.gitignore, (File)' }).click();
    await page.getByTestId('latest-commit-html').getByRole('link', { name: '#1083' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('chore: update to Docusaurus v3 #1083');
    await page.getByRole('button', { name: 'edited' }).click();
    await page.getByRole('menuitem', { name: '@mxschmitt mxschmitt created' }).click();
    await expect(page.getByRole('article')).toContainText('Build is red, since it requires our stable release to have the </> fix applied.');
  });
}
