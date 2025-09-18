import { Browser, Page } from 'puppeteer';
import { SESSION } from '../constants/SESSION.ts';
import { createUserId } from './createUserId.ts';
import { setUserId } from './setUserId.ts';
import { log } from './log.ts';

export const doLogin = async (browserInstance: Browser, page: Page) => {
  log.info('Session not found, logging in...');

  const userId = await createUserId(browserInstance);

  if (!userId) {
    throw new Error('Login failed, USERID not found');
  }

  await setUserId(userId);

  await page.evaluate(
    (key, userIdValue) => {
      window.sessionStorage.setItem(key, userIdValue);
    },
    SESSION.userId,
    userId
  );

  await page.reload({ waitUntil: 'networkidle2' });

  log.info('Session set, logged in');
};
