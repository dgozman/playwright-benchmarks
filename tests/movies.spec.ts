import { test, expect } from '@playwright/test';
import { reps } from '../common';

test.use({
  baseURL: 'https://demo.playwright.dev/movies/',
});

for (let i = 0; i < reps; i++) {
  test.describe('Movie Details Page - Content ' + i, () => {
    test('static content on movie and dynamic votes through mocking', {
        tag: '@mocking',
      }, async ({ page }) => {
        // Get the response and add to it as average votes is dynamic content
        await page.route(
          '*/**/**718821?append_to_response=videos',
          async (route) => {
            const response = await route.fetch();
            const json = await response.json();
            //mock the average votes as this will normally change
            json.vote_average = 7.02;

            await route.fulfill({ response, json });
          }
        );
        const movie = page.getByRole('main');
        await page.goto('movie?id=718821&page=1');

        await test.step('movie headings', async () => {
          await expect(movie.getByRole('heading', { level: 1 }))
            .toHaveText('Twisters');
          await expect(movie.getByRole('heading', { level: 2 }))
            .toHaveText('Chase. Ride. Survive.');

          await expect(movie.getByRole('heading', { level: 3 })).toHaveText([
            /The Genres/,
            /The Synopsis/,
            /The Cast/,
          ]);
        });

        await test.step('movie details', async () => {
          await expect(movie.getByLabel('rating value')).toHaveText('7.02');

          await expect(movie.getByRole('list', { name: 'Genres' })
            .getByRole('listitem'))
            .toHaveText([
              /Action/,
              /Adventure/,
              /Thriller/
          ]);

          await expect(movie.getByLabel('The Synopsis'))
            .toHaveText(/As storm season intensifies/);
        });

        await test.step('language, duration, year of release', async () => {
          await expect(movie.getByLabel('language')).toHaveText(/English/);
          await expect(movie.getByLabel('duration')).toHaveText(/123 min/);
          await expect(movie.getByLabel('year of release')).toHaveText('2024');
        });
      }
    );
  });

  test.describe('Movie Details Page - Links ' + i, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('movie?id=718821&page=1');
    });

    test('links on movie page', async ({ page }) => {
      await page.getByRole('link', { name: 'Action' }).click();
      await expect(page).toHaveURL(/Action/);
      await expect(page.getByRole('heading', { name: 'Action' })).toBeVisible();
    });

    test('adventure genre link', async ({ page }) => {
      await page.getByRole('link', { name: 'Adventure' }).click();
      await expect(page).toHaveURL(/Adventure/);
      await expect(page.getByRole('heading', { name: 'Adventure' })).toBeVisible();
    });

    test('thriller genre link', async ({ page }) => {
      await page.getByRole('link', { name: 'Thriller' }).click();
      await expect(page).toHaveURL(/Thriller/);
      await expect(page.getByRole('heading', { name: 'Thriller' })).toBeVisible();
    });

    test('links to cast page and back button', async ({ page }) => {
      await page.getByRole('link', { name: 'Samantha Ireland' }).click();
      await expect(page.getByRole('heading', { name: 'Samantha Ireland' }))
        .toBeVisible();
      await page.getByRole('button', { name: 'Back' }).click();
      await expect(page.getByRole('heading', { name: 'Twisters' })).toBeVisible();
    });

    test('link to website works', {
        tag: '@mocking',
      }, async ({ page }) => {
        await page.context().route('https://www.twisters-movie.com/**', (route) =>
          route.fulfill({
            body: '<html><body><h1>Twisters movie website</h1></body></html>',
          })
        );

        const page1Promise = page.waitForEvent('popup');
        await page.getByRole('button', { name: 'Website' }).click();
        const page1 = await page1Promise;
        await expect(page1).toHaveURL(/twisters-movie/);
      }
    );

    test('link to IMDB works', {
        tag: '@mocking',
      }, async ({ page }) => {
        await page.context().route('https://www.imdb.com/**', (route) =>
          route.fulfill({
            body: '<html><body><h1>IMDB website</h1></body></html>',
          })
        );

        const page1Promise = page.waitForEvent('popup');
        await page.getByRole('button', { name: 'IMDB' }).click();
        const page1 = await page1Promise;
        await expect(page1).toHaveURL(/imdb/);
      }
    );
  });
}
