import { Browser } from 'puppeteer';

export const createUserId = async (browserInstance: Browser) => {
  const incognitoBrowser = browserInstance.defaultBrowserContext();

  const loginPage = await incognitoBrowser.newPage();

  await loginPage.goto(process.env.E3M_PAGE_URL!, {
    waitUntil: 'networkidle2',
  });

  await loginPage.waitForSelector('.login-username-input', {
    timeout: 30000,
  });

  await loginPage.type('.login-username-input', process.env.E3M_USERNAME!);
  await loginPage.type('.login-password-input', process.env.E3M_PASSWORD!);

  await Promise.all([
    loginPage.click('.login-button-input'),
    loginPage.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);

  const userId = await loginPage.evaluate(() => {
    return window.sessionStorage.getItem('USERID');
  });

  await loginPage.close();
  return userId;
};
