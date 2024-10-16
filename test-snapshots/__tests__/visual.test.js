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

  test('Full pafe snapshot', async function () {
    await page.goto('https://www.example.com');
    await page.waitForSelector('h1');
    const image = await page.screenshot();
    //   Pass if difference is less than 500px
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'pixel',
      failureThreshold: 500,
    });
  });
});
