import { test, expect } from '@playwright/test';

test.describe('PWA Configuration', () => {
  test('should generate a valid web manifest', async ({ request }) => {
    // The vite-plugin-pwa generates manifest.webmanifest by default
    const response = await request.get('http://localhost:3000/manifest.webmanifest');
    expect(response.ok()).toBeTruthy();
    
    const manifest = await response.json();
    expect(manifest.name).toBe('Subway Reader');
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons.length).toBeGreaterThan(0);
  });
});