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
    await page.goto('https://github.com/microsoft');
    await page.getByRole('link', { name: /Repositories [\d\.]+/ }).click();
    await page.getByTestId('filter-input').fill('playwright');
    await page.getByTestId('filter-input').press('Enter');
    await page.getByRole('link', { name: 'playwright.dev', exact: true }).click();
    await page.getByRole('link', { name: '.gitignore, (File)' }).click();
    await page.getByTestId('latest-commit-html').getByRole('link', { name: '#1083' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('chore: update to Docusaurus v3 #1083');
  });
}
