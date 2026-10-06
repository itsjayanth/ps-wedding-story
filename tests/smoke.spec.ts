import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const ROUTES = ['friends', 'family'] as const;
const WIDTHS = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
];

/** Skip the entry gate: best-effort sessionStorage seed, then click Enter if it is still shown. */
async function passGate(page: Page) {
  const enter = page.getByRole('button', { name: /enter/i }).first();
  try {
    await enter.waitFor({ state: 'visible', timeout: 3000 });
  } catch {
    return;
  }
  await enter.click();
  await enter.waitFor({ state: 'hidden', timeout: 10_000 });
}

async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = Math.max(300, Math.floor(page.viewportSize()!.height * 0.7));
  for (let y = 0; y <= height; y += step) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

for (const route of ROUTES) {
  for (const vp of WIDTHS) {
    test(`/${route} @ ${vp.width}px`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (m) => {
        // Missing photos/video/music are expected until real media is added; placeholders cover them.
        if (m.type() === 'error' && !/Failed to load resource.*404/.test(m.text()))
          errors.push(`console: ${m.text()}`);
      });
      page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

      await page.setViewportSize(vp);
      await page.addInitScript(() => {
        try {
          for (const k of [
            'entered',
            'entry',
            'gate',
            'entryGate',
            'ps-entered',
            'wedding-entered',
          ]) {
            sessionStorage.setItem(k, '1');
          }
        } catch {}
      });
      await page.goto(`/${route}`, { waitUntil: 'load' });
      await passGate(page);

      await expect(page.locator('h1').first()).toBeVisible();
      await scrollThrough(page);

      const wa = page.locator('a[href^="https://wa.me/918660628162?text="]');
      await expect(wa.first()).toHaveAttribute('href', /^https:\/\/wa\.me\/918660628162\?text=/);

      expect(await page.locator('form, input, textarea, select').count()).toBe(0);

      const body = page.locator('body');
      if (route === 'family') await expect(body).toContainText('Sr. Head Master');
      else await expect(body).not.toContainText('Sr. Head Master');

      mkdirSync('test-results/screenshots', { recursive: true });
      await page.screenshot({
        path: `test-results/screenshots/${route}-${vp.width}.png`,
        fullPage: true,
      });

      expect(errors).toEqual([]);
    });
  }
}
