import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { LoginPage } from './pages/LoginPage.js';
import { AdminRegistrationsPage } from './pages/AdminRegistrationsPage.js';
import { RegistrationPage } from './pages/RegistrationPage.js';
import { ProfilePage } from './pages/ProfilePage.js';

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

  this.baseUrl =
    process.env.BASE_URL || process.env.FRONTEND_URL || 'http://localhost:3001';

  this.pages = {
    login: new LoginPage(this.driver, this.baseUrl),
    registration: new RegistrationPage(this.driver, this.baseUrl),
    adminRegistrations: new AdminRegistrationsPage(this.driver, this.baseUrl),
    profile: new ProfilePage(this.driver, this.baseUrl),
    adminRegistrations: new AdminRegistrationsPage(this.driver, this.baseUrl),
    profile: new ProfilePage(this.driver, this.baseUrl),
  };
});

After(async function () {
  if (this.driver) {
    await this.driver.quit();
  }
});
