import { By, until } from 'selenium-webdriver';

export class RegistrationPage {
  constructor(driver, baseUrl) {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async open() {
    await this.driver.get(`${this.baseUrl}/register`);
    await this.driver.wait(until.elementLocated(By.name('name')));
  }

  async submitEmptyForm() {
    await this.driver.findElement(By.css('button[type="submit"]')).click();
  }

  async waitForValidationErrors() {
    await this.driver.wait(until.elementLocated(By.css('[aria-invalid="true"]')));
  }
}
