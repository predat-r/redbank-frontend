/* global process */
import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

setDefaultTimeout(60000);

Before(async function () {
  const options = new chrome.Options();

  // Check HEADLESS environment variable (default to false if explicitly set to 'false' or omitted for visual debugging)
  const isHeadless = process.env.HEADLESS === 'true';
  if (isHeadless) {
    options.addArguments('--headless=new');
  }

  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1280,800');

  this.driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  this.baseUrl = process.env.BASE_URL || 'http://localhost:5173';
});

After(async function () {
  if (this.driver) {
    await this.driver.quit();
  }
});
