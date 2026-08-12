import { By, until } from 'selenium-webdriver';

export class ProfilePage {
  constructor(driver, baseUrl) {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async open() {
    await this.driver.get(`${this.baseUrl}/profile`);
    await this.driver.wait(
      until.elementLocated(By.xpath("//h1[contains(text(), 'My Profile')]"))
    );
  }

  async getProfileName() {
    const input = await this.driver.findElement(By.name('name'));
    return await input.getAttribute('value');
  }

  async updateProfile(name, phone, address) {
    const nameInput = await this.driver.findElement(By.name('name'));
    await nameInput.clear();
    await nameInput.sendKeys(name);

    const phoneInput = await this.driver.findElement(By.name('phoneNumber'));
    await phoneInput.clear();
    await phoneInput.sendKeys(phone);

    const addressInput = await this.driver.findElement(By.name('address'));
    await addressInput.clear();
    await addressInput.sendKeys(address);

    await this.driver
      .findElement(By.xpath("//button[contains(., 'Save Profile Changes')]"))
      .click();
  }

  async switchToSecurityTab() {
    await this.driver
      .findElement(By.xpath("//button[contains(., 'Password & Security')]"))
      .click();
    await this.driver.wait(until.elementLocated(By.name('currentPassword')));
  }

  async changePassword(currentPass, newPass, confirmPass) {
    await this.driver.findElement(By.name('currentPassword')).sendKeys(currentPass);
    await this.driver.findElement(By.name('newPassword')).sendKeys(newPass);
    await this.driver.findElement(By.name('confirmPassword')).sendKeys(confirmPass);
    await this.driver
      .findElement(By.xpath("//button[contains(., 'Update Password')]"))
      .click();
  }

  async getAccountFreezeButtonState() {
    // Returns 'frozen' if "Unfreeze Account" is visible in the safety controls,
    // 'active' if "Freeze Account" is visible,
    // or null if neither found within timeout
    try {
      const safeControlsXpath = `//h4[text()='Account Safety Controls']/following-sibling::button`;
      await this.driver.wait(
        until.elementLocated(
          By.xpath(
            `${safeControlsXpath}[contains(., 'Freeze Account') or contains(., 'Unfreeze Account')]`
          )
        ),
        10000
      );
      const unfreezeButtons = await this.driver.findElements(
        By.xpath(`${safeControlsXpath}[contains(., 'Unfreeze Account')]`)
      );
      return unfreezeButtons.length > 0 ? 'frozen' : 'active';
    } catch {
      return null;
    }
  }

  async ensureAccountActive() {
    const state = await this.getAccountFreezeButtonState();
    if (state === 'frozen') {
      // Account is stuck frozen from a previous run — unfreeze it first
      await this.toggleAccountFreeze('Unfreeze');
      await this.waitForSuccessToast();
      // Wait for React to re-render the Freeze button after the state change
      await this.driver.wait(
        until.elementLocated(
          By.xpath(
            "//h4[text()='Account Safety Controls']/following-sibling::button[contains(., 'Freeze Account')]"
          )
        ),
        10000
      );
    }
  }

  async toggleAccountFreeze(action) {
    // action is either 'Freeze' or 'Unfreeze'
    // Strict XPath ensures we don't accidentally click the global "Unfreeze Account ->" AppShell banner!
    const actionBtn = await this.driver.wait(
      until.elementLocated(
        By.xpath(
          `//h4[text()='Account Safety Controls']/following-sibling::button[contains(., '${action} Account')]`
        )
      ),
      10000
    );

    // Scroll button into view so it's not behind the sticky topbar
    await this.driver.executeScript(
      "arguments[0].scrollIntoView({ block: 'center' });",
      actionBtn
    );
    await this.driver.sleep(500);

    // Try native click first (works with React events), fall back to JS click
    try {
      await actionBtn.click();
    } catch {
      await this.driver.executeScript('arguments[0].click();', actionBtn);
    }

    // Wait for the modal dialog to appear
    await this.driver.wait(until.elementLocated(By.css("div[role='dialog']")), 5000);

    // Now find and click the confirm button inside the dialog
    const confirmButton = await this.driver.wait(
      until.elementLocated(
        By.xpath(`//div[@role='dialog']//button[contains(., 'Confirm ${action}')]`)
      ),
      5000
    );
    await this.driver.sleep(300);

    try {
      await confirmButton.click();
    } catch {
      await this.driver.executeScript('arguments[0].click();', confirmButton);
    }

    // Wait for the modal to fully close before proceeding
    await this.driver.wait(until.stalenessOf(confirmButton), 5000).catch(() => {});
  }

  async waitForSuccessToast() {
    const toastLocator = By.xpath(
      "//div[@role='alert'][.//*[contains(text(), 'successfully') or contains(text(), 'active') or contains(text(), 'unlocked') or contains(text(), 'executed') or contains(text(), 'locked')]]"
    );
    const toast = await this.driver.wait(until.elementLocated(toastLocator), 10000);

    // Dismiss the toast so subsequent steps don't instantly pass on this old toast
    try {
      const dismissBtn = await toast.findElement(
        By.css("button[aria-label='Dismiss toast']")
      );
      await this.driver.executeScript('arguments[0].click();', dismissBtn);
      await this.driver.wait(until.stalenessOf(toast), 2000);
    } catch (e) {
      console.warn('Could not dismiss toast:', e);
    }
  }
}
