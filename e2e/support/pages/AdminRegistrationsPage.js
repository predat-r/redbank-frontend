import { By, until } from 'selenium-webdriver';

export class AdminRegistrationsPage {
  constructor(driver, baseUrl) {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async open() {
    await this.driver.get(`${this.baseUrl}/admin/registrations`);
    await this.driver.wait(until.elementLocated(By.css('table')));
  }

  async approveRegistration(email) {
    const row = By.xpath(`//tr[.//td[normalize-space()=${JSON.stringify(email)}]]`);
    await this.driver.findElement(By.css('select')).sendKeys('50');
    await this.driver.wait(
      async () => (await this.driver.findElements(By.css('tbody tr'))).length > 0
    );

    const pageCount = await this.totalPages();
    let registrationRow;

    for (let page = 1; page <= pageCount; page += 1) {
      const matches = await this.driver.findElements(row);
      if (matches.length) {
        [registrationRow] = matches;
        break;
      }
      await this.goToNextPage();
    }

    if (!registrationRow) {
      throw new Error(
        `Could not find pending registration for ${email} on any admin page.`
      );
    }

    await registrationRow
      .findElement(By.xpath(".//button[normalize-space()='Approve']"))
      .click();
    await this.driver.wait(
      until.elementLocated(By.xpath("//*[normalize-space()='Approve registration']"))
    );
    await this.driver
      .findElement(By.xpath("//button[normalize-space()='Approve Registration']"))
      .click();
    await this.driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(normalize-space(), 'Registration approved')]")
      )
    );
  }

  async totalPages() {
    const label = await this.driver.findElement(
      By.xpath("//*[starts-with(normalize-space(), 'Page ')]")
    );
    const match = (await label.getText()).match(/Page\s+\d+\s+of\s+(\d+)/);
    return Number(match?.[1] || 1);
  }

  async goToNextPage() {
    const label = this.driver.findElement(
      By.xpath("//*[starts-with(normalize-space(), 'Page ')]")
    );
    const current = await label.getText();
    await this.driver.findElement(By.css('button[title="Next Page"]')).click();
    await this.driver.wait(async () => (await label.getText()) !== current);
  }
}
