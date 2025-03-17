import { AstMemoryEfficientTransformer } from '@angular/compiler';
import { test, expect } from '@playwright/test';

test.describe('ItemsComponent', () => {
  let defaultPageSize = 5;

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
  });

  test('should display stories, search box, and handle pagination', async ({ page }) => {
    await test.step('Check page title', async () => {
      await expect(page.locator('.top-bar .title')).toHaveText('Hacker News');
    });

    await test.step('Check Top Stories header', async () => {
      await expect(page.locator('[data-testid="top-stories-toolbar"]')).toHaveText('Top Stories');
    });

    await test.step('Check search box visibility', async () => {
      await expect(page.locator('[data-testid="search-box"]')).toBeVisible();
    });

    await test.step('Check that stories list has items', async () => {
      await expect(page.locator('mat-list mat-list-item')).toHaveCount(defaultPageSize);
    });

    await test.step('Check that stories list items show details', async () => {
      let firstCard = page.locator('mat-card .story-card').first();
      await expect(firstCard.locator('[data-testid="story-author"]')).toContainText('By: ');
      await expect(firstCard.locator('[data-testid="story-time"]')).toHaveText(/^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}$/);
      await expect(firstCard.locator('[data-testid="story-score"]')).toContainText('Score: ');
      await expect(firstCard.locator('[data-testid="story-comments-link"], [data-testid="story-no-comments"]')).toContainText('comment');
    });


    await test.step('Paginate to the next page', async () => {
      await page.click('button[aria-label="Next page"]');
      await expect(page.locator('mat-list mat-list-item')).toHaveCount(defaultPageSize);
    });
  });

  test('should search for particular stories', async ({ page }) => {
    let firstCard = page.locator('mat-card .story-card').first();
    let firstCardTitle = await firstCard.locator('[data-testid="story-title"]').textContent();

    await test.step('Search for a story', async () => {
      await page.fill('[data-testid="search-box"]', firstCardTitle);
      await expect(page.locator('mat-list mat-list-item')).toHaveCount(1);
    });

    await test.step('Check that the story is displayed', async () => {
      await expect(firstCard.locator('[data-testid="story-title"]')).toContainText(firstCardTitle);
    });
  })

  test('should display message when a search returns no results' , async ({ page }) => {
    await test.step('Search for a nonexistent story', async () => {
      await page.fill('[data-testid="search-box"]', 'A Nonexistent Story!');
      await expect(page.locator('.no-stories-message p')).toHaveText("Oops. There aren't stories matching your search.");
    });
  });
});
