import { defineConfig } from '@playwright/test';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

/** Use the pre-installed Chromium when the pinned Playwright build is not available. */
function findChromium(): string | undefined {
  if (process.env.PW_CHROMIUM_PATH) return process.env.PW_CHROMIUM_PATH;
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!root || !existsSync(root)) return undefined;
  for (const dir of readdirSync(root)
    .filter((d) => /^chromium-\d+$/.test(d))
    .sort()
    .reverse()) {
    const p = path.join(root, dir, 'chrome-linux', 'chrome');
    if (existsSync(p)) return p;
  }
  return undefined;
}

const executablePath = findChromium();
const PORT = 3100;

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  outputDir: 'test-results/artifacts',
  use: {
    baseURL: `http://localhost:${PORT}`,
    browserName: 'chromium',
    launchOptions: executablePath
      ? { executablePath, args: ['--no-sandbox'] }
      : { args: ['--no-sandbox'] },
  },
  webServer: {
    command: `npm run build && npx serve out -l ${PORT} --no-clipboard`,
    url: `http://localhost:${PORT}/friends`,
    reuseExistingServer: true,
    timeout: 240_000,
  },
});
