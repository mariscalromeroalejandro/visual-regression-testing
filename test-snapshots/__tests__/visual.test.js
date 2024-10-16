const { toMatchImageSnapshot } = require('jest-image-snapshot');
const puppeteer = require('puppeteer');

expect.extend({ toMatchImageSnapshot });

describe('Visual Regression Testing', () => {
  let browser;
  let page;

  beforeAll(async function () {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  afterAll(async function () {
    await browser.close();
  });

  test('Full page snapshot', async function () {
    await page.goto('https://www.example.com');
    await page.waitForSelector('h1');
    const image = await page.screenshot();
    //   Pass if difference is less than 500px
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'pixel',
      failureThreshold: 500,
    });
  });

  test('Single Element Snapshot', async function () {
    await page.goto('https://www.example.com');
    const h1 = await page.waitForSelector('h1');
    const image = await h1.screenshot();
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'percent',
      failureThreshold: 0.01,
    });
  });

  test('Mobile snapshot', async function () {
    await page.goto('https://www.example.com');
    await page.waitForSelector('h1');
    await page.emulate(puppeteer.KnownDevices['iPhone X']);
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'percent',
      failureThreshold: 0.01,
    });
  });

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
});
