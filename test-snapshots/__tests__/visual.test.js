const { toMatchImageSnapshot } = require('jest-image-snapshot');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');

// Extend Jest's expect with the toMatchImageSnapshot matcher
expect.extend({ toMatchImageSnapshot });

describe('Visual Regression Testing', () => {
  let browser;
  let page;

  // Setup the browser and page before all tests run
  beforeAll(async function () {
    const snapshotsPath = 'test-snapshots/__tests__/__image_snapshots__';
    await fs.remove(snapshotsPath);
    browser = await puppeteer.launch({ headless: true }); // Launch a headless browser
    page = await browser.newPage(); // Create a new page instance
  });

  // Close the browser after all tests have completed
  afterAll(async function () {
    await browser.close(); // Close the browser instance
  });

  // Test to take a full page screenshot
  test('Full page snapshot', async function () {
    await page.goto('https://www.example.com');
    await page.waitForSelector('h1');
    const image = await page.screenshot(); // Capture a screenshot of the full page
    // Pass if the difference in pixels is less than 500
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'pixel',
      failureThreshold: 500,
    });
  });

  // Test to take a screenshot of a single element
  test('Single Element Snapshot', async function () {
    await page.goto('https://www.example.com');
    const h1 = await page.waitForSelector('h1');
    const image = await h1.screenshot(); // Capture a screenshot of the <h1> element
    // Pass if the difference in percentage is less than 0.01%
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'percent',
      failureThreshold: 0.01,
    });
  });

  // Test to take a mobile device screenshot
  test('Mobile snapshot', async function () {
    await page.goto('https://www.example.com');
    await page.waitForSelector('h1');
    await page.emulate(puppeteer.KnownDevices['iPhone X']); // Emulate an iPhone X
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'percent',
      failureThreshold: 0.01,
    });
  });

  // Test to take a tablet device screenshot
  test('Tablet snapshot', async function () {
    await page.goto('https://www.example.com');
    await page.waitForSelector('h1');
    await page.emulate(puppeteer.KnownDevices['iPad Pro 11']);
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'percent',
      failureThreshold: 0.01,
    });
  });

  // Test to remove an element before taking a snapshot
  test('Remove Element Before Snapshot', async function () {
    await page.goto('https://www.example.com');
    await page.evaluate(() => {
      // Remove all <h1> elements from the page
      document.querySelectorAll('h1').forEach((e) => {
        e.remove();
      });
    });
  });
});
