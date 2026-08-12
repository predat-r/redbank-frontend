import { After, Before, setDefaultTimeout } from '@cucumber/cucumber';
import chrome from 'selenium-webdriver/chrome.js';
import { Builder } from 'selenium-webdriver';
import { LoginPage } from './pages/LoginPage.js';
import { AdminRegistrationsPage } from './pages/AdminRegistrationsPage.js';
import { RegistrationPage } from './pages/RegistrationPage.js';

setDefaultTimeout(30_000);

Before(async function () {
  const options = new chrome.Options();
  if (process.env.HEADLESS === 'true') {
    options.addArguments('--headless=new', '--no-sandbox', '--disable-dev-shm-usage');
  }

  this.driver = await new Builder()
    .forBrowser(process.env.BROWSER || 'chrome')
    .setChromeOptions(options)
    .build();
  this.pages = {
    login: new LoginPage(this.driver, this.baseUrl),
    registration: new RegistrationPage(this.driver, this.baseUrl),
    adminRegistrations: new AdminRegistrationsPage(this.driver, this.baseUrl),
  };
});

After(async function () {
  if (this.driver) await this.driver.quit();
});
