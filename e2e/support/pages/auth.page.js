/* global process */
import { By, until } from 'selenium-webdriver';

export class AuthPageObject {
  constructor(driver) {
    this.driver = driver;
  }

  locators = {
    emailInput: By.xpath("//input[@name='email' or @type='email']"),
    passwordInput: By.xpath("//input[@name='password' or @type='password']"),
    submitButton: By.xpath("//button[@type='submit']"),
    dashboardHeader: By.xpath(
      "//*[contains(text(), 'Dashboard') or contains(text(), 'Welcome')]"
    ),
  };

  async gotoLogin(baseUrl = 'http://localhost:3001') {
    await this.driver.get(`${baseUrl}/login`);
    await this.driver.wait(until.elementLocated(this.locators.emailInput), 5000);
  }

  async login(
    baseUrl = 'http://localhost:3001',
    email = process.env.E2E_USER_EMAIL || 'user@example.com',
    password = process.env.E2E_USER_PASSWORD || 'Password123!'
  ) {
    await this.gotoLogin(baseUrl);

    const emailEl = await this.driver.findElement(this.locators.emailInput);
    await emailEl.clear();
    await emailEl.sendKeys(email);

    const passwordEl = await this.driver.findElement(this.locators.passwordInput);
    await passwordEl.clear();
    await passwordEl.sendKeys(password);

    const submitBtn = await this.driver.findElement(this.locators.submitButton);
    await submitBtn.click();

    // Wait until logged in (redirected away from /login)
    await this.driver.wait(async () => {
      const url = await this.driver.getCurrentUrl();
      return !url.includes('/login');
    }, 10000);
  }
}
