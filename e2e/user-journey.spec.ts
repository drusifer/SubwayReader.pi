import { test, expect } from '@playwright/test';

test.describe('Subway Reader User Journey (E2E)', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('User can sync articles and read them', async ({ page }) => {
    // 1. Initial State: Verify we see the feed and Sim mode
    await expect(page).toHaveTitle('Subway Reader');
    await expect(page.getByTestId('mode-badge')).toHaveText('SIMULATED');
    
    // Check first article is not downloaded (cloud icon)
    const firstArticleId = '1'; 
    await expect(page.getByTestId(`status-cloud-${firstArticleId}`)).toBeVisible();

    // 2. Action: Click Sync
    const syncButton = page.getByTestId('sync-button');
    await syncButton.click();

    // 3. Wait for Sync to complete
    // The button text changes to "Syncing..." then back to "SYNC FEED"
    await expect(syncButton).toContainText('Syncing');
    await expect(syncButton).toContainText('SYNC FEED', { timeout: 10000 });

    // 4. Verify Downloaded State
    // Cloud icon should be replaced by Check icon
    await expect(page.getByTestId(`status-downloaded-${firstArticleId}`)).toBeVisible();
    await expect(page.getByTestId(`status-cloud-${firstArticleId}`)).not.toBeVisible();

    // 5. Action: Read Article
    await page.getByTestId(`article-card-${firstArticleId}`).click();

    // 6. Verify Reader View
    // Should see the mocked markdown content rendered
    await expect(page.getByRole('article')).toBeVisible();
    await expect(page.getByText('The Future of Offline-First Web Apps')).toBeVisible(); // Title from MOCK_MARKDOWN
    await expect(page.getByText('Jane Doe')).toBeVisible(); // Author from MOCK_MARKDOWN

    // 7. Action: Go Back
    await page.getByRole('button').first().click(); // Back arrow
    
    // 8. Verify back on Feed
    await expect(page.getByTestId('sync-button')).toBeVisible();
  });

  test('Settings modal can toggle dark mode', async ({ page }) => {
    // Open settings
    await page.getByTestId('settings-button').click();
    
    // Find dark mode toggle and click
    const darkModeToggle = page.locator('text=Dark Mode').locator('..').getByRole('button');
    await darkModeToggle.click();

    // Verify dark class added to html (simplified check)
    // In a real browser test, we'd check the Computed Styles or classList on <html>
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });
});