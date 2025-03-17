import { test, expect } from '@playwright/test';

test.describe('Stories Tests', () => {
  const defaultPageSize = 5;
  const baseUrl = 'http://localhost:4200';

  // Locators
  const locators = {
    pageTitle: '.top-bar .title',
    topStoriesHeader: '[data-testid="top-stories-toolbar"]',
    searchBox: '[data-testid="search-box"]',
    storyListItems: 'mat-list mat-list-item',
    firstStoryCard: 'mat-card .story-card',
    storyAuthor: '[data-testid="story-author"]',
    storyTime: '[data-testid="story-time"]',
    storyScore: '[data-testid="story-score"]',
    storyCommentsLink: '[data-testid="story-comments-link"], [data-testid="story-no-comments"]',
    nextPageButton: 'button[aria-label="Next page"]',
    noStoriesMessage: '.no-stories-message p',
    storyTitle: '[data-testid="story-title"]'
  };

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
  });

  test('should display stories, search box, and handle pagination', async ({ page }) => {
    await test.step('Check page title', async () => {
      await expect(page.locator(locators.pageTitle)).toHaveText('Hacker News');
    });

    await test.step('Check Top Stories header', async () => {
      await expect(page.locator(locators.topStoriesHeader)).toHaveText('Top Stories');
    });

    await test.step('Check search box visibility', async () => {
      await expect(page.locator(locators.searchBox)).toBeVisible();
    });

    await test.step('Check that stories list has items', async () => {
      await expect(page.locator(locators.storyListItems)).toHaveCount(defaultPageSize);
    });

    await test.step('Check that stories list items show details', async () => {
      const firstCard = page.locator(locators.firstStoryCard).first();
      await expect(firstCard.locator(locators.storyAuthor)).toContainText('By: ');
      await expect(firstCard.locator(locators.storyTime)).toHaveText(
        /^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}$/
      );
      await expect(firstCard.locator(locators.storyScore)).toContainText('Score: ');
      await expect(firstCard.locator(locators.storyCommentsLink)).toContainText('comment');
    });

    await test.step('Paginate to the next page', async () => {
      await page.click(locators.nextPageButton);
      await expect(page.locator(locators.storyListItems)).toHaveCount(defaultPageSize);
    });
  });

  test('should search for particular stories', async ({ page }) => {
    const firstCard = page.locator(locators.firstStoryCard).first();
    const firstCardTitle = (await firstCard.locator(locators.storyTitle).textContent()) || '';

    await test.step('Search for a story', async () => {
      await page.fill(locators.searchBox, firstCardTitle);
      await expect(page.locator(locators.storyListItems)).toHaveCount(1);
    });

    await test.step('Check that the story is displayed', async () => {
      await expect(firstCard.locator(locators.storyTitle)).toContainText(firstCardTitle);
    });
  });

  test('should display message when a search returns no results', async ({ page }) => {
    await test.step('Search for a nonexistent story', async () => {
      await page.fill(locators.searchBox, 'A Nonexistent Story!');
      await expect(page.locator(locators.noStoriesMessage)).toHaveText(
        "Oops. There aren't stories matching your search."
      );
    });
  });
});
