const percySnapshot = require('@percy/puppeteer');
const puppeteer = require('puppeteer');

describe('Percy Visual Test', () => {
  let browser;
  let page;
  beforeAll(async function () {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async function () {
    await browser.close();
  });

  test('Full page Percy Snapshot', async function () {
    await page.goto('https://www.example.com');
    await page.evaluate(() => {
      // Remove all <h1> elements from the page
      document.querySelectorAll('h1').forEach((e) => {
        e.remove();
      });
    });

    await percySnapshot(page, 'Example page');
  });
});
