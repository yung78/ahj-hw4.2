import puppeteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(90000);

describe('Test validation form', () => {
  let browser;
  let page;
  let server;

  beforeAll(async () => {
    server = fork('./e2e.server.js');
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        } else {
          reject()
        }
      });
    });

    browser = await puppeteer.launch({
      // headless: false,
      // slowMo: 100,
      // devtools: true,
    });

    page = await browser.newPage();
  });

  test('validation, if card number is valid: ".answer.valid" add ".valid_active"', async () => {
    await page.goto('http://localhost:9000');
    await page.waitForSelector('.pay_form');

    await page.locator('input').fill('2345 6789 1234 5678');
    await page.locator('button').click();

    await page.waitForSelector('.answer.valid.valid_active');
  });

  test('---//---//--- not valid: ".answer.not_valid" add ".valid_active"', async () => {
    await page.goto('http://localhost:9000');
    await page.waitForSelector('.pay_form');

    await page.locator('input').fill('2345 6789 1234 5679');
    await page.locator('button').click();

    await page.waitForSelector('.answer.not_valid.valid_active');
  });

  afterAll(async () => {
    await browser.close();
    await server.off
  });
});
