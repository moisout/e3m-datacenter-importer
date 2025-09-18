import puppeteer from 'puppeteer';
import { SESSION } from './constants/SESSION.ts';
import { URLS } from './constants/URLS.ts';
import { doLogin } from './methods/doLogin.ts';
import { getUserId } from './methods/getUserId.ts';
import { log } from './methods/log.ts';

export const fetchData = async () => {
  const requiredEnvVars = ['E3M_USERNAME', 'E3M_PASSWORD'];
  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      throw new Error(`Environment variable ${varName} is not set`);
    }
  }

  log.info('Launching browser...');

  const browserInstance = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--incognito'],
  });

  try {
    const page = await browserInstance.pages().then((pages) => pages[0]);

    await page.goto(URLS.datacenter);

    const userId = await getUserId();

    if (!userId) {
      await doLogin(browserInstance, page);
    } else {
      await page.evaluate(
        (key, userIdValue) => {
          window.sessionStorage.setItem(key, userIdValue);
        },
        SESSION.userId,
        userId
      );
    }

    await page.setViewport({ width: 1920, height: 1080 });

    await page.reload({ waitUntil: 'networkidle2' });

    log.info('Waiting for Ok button...');

    await page
      .waitForSelector('.btns-ok.btn-confirm::-p-text("OK")', { timeout: 5000 })
      .catch(async () => {
        const loginForm = await page.$('.login-username-input');
        if (loginForm) {
          log.info('Session expired, logging in again...');
          await doLogin(browserInstance, page);
          await page.waitForSelector('.btns-ok.btn-confirm::-p-text("OK")');
        } else {
          throw new Error('Ok button not found and login form not found');
        }
      });

    await page.waitForSelector('.btns-ok.btn-confirm::-p-text("OK")', {
      hidden: true,
    });

    log.info('Ok button gone, we are logged in!');

    await page.waitForSelector('[id="-282_anchor"]');

    const pgSelectorOpen = await page.evaluate(async () => {
      return (
        document
          .querySelector('[id="-282_anchor"]')
          ?.attributes.getNamedItem('aria-expanded')?.value === 'true'
      );
    });

    log.info('PG Selector open: ' + pgSelectorOpen);

    if (!pgSelectorOpen) {
      log.info('Opening PG Selector...');
      await page.click('[id="-282_anchor"]', { delay: 100 });
    }

    const data: any[] = [];

    await new Promise(async (resolve, reject) => {
      page.on('response', async (response) => {
        if (response.url().includes(URLS.widgetActionServlet)) {
          try {
            const responseBody = await response.json();
            if (responseBody) {
              data.push(responseBody);
            }
          } catch (error) {
            log.error('Error parsing response body:', error);
          }
        }
      });

      await page.waitForSelector('[id="-282_776_anchor"]');
      await page.click('[id="-282_776_anchor"]');

      let timer = 0;
      const maxWaitTime = 30000;
      const intervalTime = 500;

      const interval = setInterval(() => {
        if (data.length >= 5) {
          clearInterval(interval);
          resolve(true);
        } else {
          timer += intervalTime;
        }

        if (timer >= maxWaitTime) {
          clearInterval(interval);
          reject(new Error('Timeout waiting for data'));
        }
      }, 500);
    });

    await page.close();
    await browserInstance.close();

    log.info(`Fetched ${data.length} data entries`);
    return data;
  } finally {
    await browserInstance.close();
  }
};
