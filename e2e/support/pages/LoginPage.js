import { By, until } from 'selenium-webdriver';

export class LoginPage {
  constructor(driver, baseUrl) {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async open() {
    await this.driver.get(`${this.baseUrl}/login`);
    await this.driver.wait(until.elementLocated(By.name('email')));
  }

  async login(email, password) {
    await this.driver.findElement(By.name('email')).sendKeys(email);
    await this.driver.findElement(By.name('password')).sendKeys(password);
    await this.driver.findElement(By.css('button[type="submit"]')).click();
  }

  async waitForDashboard() {
    await this.driver.wait(until.urlContains('/dashboard'));
  }

  async refresh() {
    await this.driver.navigate().refresh();
  }

  async signOut() {
    const signOutButton = By.xpath("//button[normalize-space()='Sign Out']");
    const visibleSignOutButtons = await this.driver.findElements(signOutButton);

    if (visibleSignOutButtons.length) {
      await visibleSignOutButtons[0].click();
      await this.driver.wait(
        until.elementLocated(By.xpath("//*[normalize-space()='Confirm Sign Out']"))
      );
      await this.driver
        .findElement(By.xpath("(//button[normalize-space()='Sign Out'])[last()]"))
        .click();
      return;
    }

    await this.driver.findElement(By.css('header div.relative > button')).click();
    await this.driver.wait(until.elementLocated(signOutButton));
    await this.driver.findElement(signOutButton).click();
  }

  async waitForLoginPage() {
    await this.driver.wait(until.urlContains('/login'));
  }

  async submitInvalidCredentials() {
    await this.login('invalid@example.com', 'definitely-invalid-password');
  }

  async submitEmptyForm() {
    await this.driver.findElement(By.css('button[type="submit"]')).click();
  }

  async waitForLoginError() {
    await this.driver.wait(until.elementLocated(By.css('[role="alert"]')));
  }
}
