import { By, until } from 'selenium-webdriver';

export class AdminPage {
  constructor(driver, baseUrl) {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async open(path = '/admin') {
    await this.driver.get(`${this.baseUrl}${path}`);
    await this.waitForHeading();
  }

  async waitForHeading(text) {
    const locator = text ? By.xpath(`//h1[normalize-space()='${text}']`) : By.css('h1');
    await this.driver.wait(until.elementLocated(locator));
  }

  async openModule(label) {
    await this.waitForNavigation();
    await this.driver
      .findElement(
        By.xpath(`//button[@title='${label}' or normalize-space()='${label}']`)
      )
      .click();
    await this.waitForHeading();
  }

  async openFirstAccountBalance() {
    await this.waitForHeading('Account holders');
    const balanceLink = await this.driver.wait(
      until.elementLocated(By.xpath("//a[contains(@href, '/admin/balance/')]"))
    );
    await balanceLink.click();
    await this.waitForHeading('Account balance');
  }

  async waitForNavigation() {
    await this.driver.wait(until.elementLocated(By.css('nav')));
  }
}
