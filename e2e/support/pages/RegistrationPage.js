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

  async submitValidRegistration(details) {
    for (const [field, value] of Object.entries(details)) {
      if (field === 'confirmedInformation') continue;
      await this.driver.findElement(By.name(field)).sendKeys(value);
    }
    await this.driver.findElement(By.name('confirmedInformation')).click();
    await this.driver.findElement(By.css('button[type="submit"]')).click();
  }

  async submitRegistration(details, { acceptTerms = true } = {}) {
    await this.submitValidRegistrationFields(details);
    if (acceptTerms)
      await this.driver.findElement(By.name('confirmedInformation')).click();
    await this.driver.findElement(By.css('button[type="submit"]')).click();
  }

  async submitValidRegistrationFields(details) {
    for (const [field, value] of Object.entries(details)) {
      await this.driver.findElement(By.name(field)).sendKeys(value);
    }
  }

  async waitForPendingReview() {
    await this.driver.wait(
      until.elementLocated(By.xpath("//*[contains(normalize-space(), 'under review')]"))
    );
  }

  async waitForValidationErrors() {
    await this.driver.wait(until.elementLocated(By.css('[aria-invalid="true"]')));
  }

  async waitForError(message) {
    await this.driver.wait(
      until.elementLocated(By.xpath(`//*[normalize-space()=${JSON.stringify(message)}]`))
    );
  }

  async waitForServerError() {
    await this.driver.wait(until.elementLocated(By.css('[role="alert"]')));
  }
}
