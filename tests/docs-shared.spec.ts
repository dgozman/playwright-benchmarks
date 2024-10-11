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
  test('docs-shared ' + i, async ({}) => {
    await page.goto('https://playwright.dev/');
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page.locator('h1')).toContainText('Installation');
    await page.getByLabel('Search').click();
    await page.getByPlaceholder('Search docs').fill('page.click');
    await page.getByRole('link', { name: 'page.click Page' }).click();
    await expect(page.getByRole('article')).toContainText('Use locator-based locator.click() instead. Read more about locators.');

    const mdnPagePromise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'UIEvent.detail' }).click();
    const mdnPage = await mdnPagePromise;
    await expect(mdnPage.getByRole('article')).toContainText('The UIEvent.detail read-only property, when non-zero, provides the current (or next, depending on the event) click count.');
    await mdnPage.close();

    await page.getByRole('button', { name: 'Node.js' }).hover();
    await page.getByRole('link', { name: '.NET' }).click();
    await expect(page.locator('#page-click')).toContainText('ClickAsync');
    await page.getByRole('button', { name: 'Classes' }).click();
    await page.getByRole('link', { name: 'LocatorAssertions' }).click();
    await expect(page.locator('h1')).toContainText('LocatorAssertions');
    await page.getByRole('link', { name: 'Docs' }).click();
    await expect(page.getByLabel('Docs sidebar')).toContainText('Release notes');
    await page.getByRole('link', { name: 'Test Runners' }).click();
    await expect(page.locator('#running-mstest-tests-in-parallel')).toContainText('Running MSTest tests in Parallel');

    await expect(page.getByLabel('GitHub repository')).toBeVisible();
    await expect(page.getByLabel('GitHub repository')).toHaveAttribute('href', 'https://github.com/microsoft/playwright-dotnet');

    await expect(page.getByRole('contentinfo').getByRole('link')).toHaveText([
      'Getting started',
      'Playwright Training',
      'Learn Videos',
      'Feature Videos',
      'Stack Overflow',
      'Discord',
      'Twitter',
      'LinkedIn',
      'GitHub',
      'YouTube',
      'Blog',
      'Ambassadors'
    ]);
    await page.getByRole('link', { name: 'Ambassadors' }).click();
    await expect(page.locator('#meet-the-ambassadors')).toContainText('Meet the Ambassadors');

    await page.getByRole('link', { name: 'Previous « Welcome' }).click();
    await expect(page).toHaveURL('https://playwright.dev/dotnet/community/welcome');

    await page.getByRole('button', { name: '.NET' }).hover();
    await page.getByRole('link', { name: 'Node.js' }).click();
  });
}
