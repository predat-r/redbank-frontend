import { By, until } from 'selenium-webdriver';

export class TransactionsPageObject {
  constructor(driver) {
    this.driver = driver;
  }

  // Locators
  locators = {
    // Tab switching
    transferTab: By.xpath(
      "//button[contains(., 'Transfer Funds') or contains(., 'Transfer')]"
    ),
    withdrawalTab: By.xpath(
      "//button[contains(., 'Cash Withdrawal') or contains(., 'Withdrawal')]"
    ),

    // Initiate Form Inputs
    destinationAccountInput: By.xpath(
      "//div[./label[contains(., 'Destination Account')]]//input | //input[@name='destinationAccountNumber']"
    ),
    withdrawalMethodSelect: By.xpath(
      "//div[./label[contains(., 'Withdrawal Method')]]//select | //select[@id='withdrawal-method' or @name='withdrawalMethod']"
    ),
    amountInput: By.xpath(
      "//div[./label[contains(., 'Amount')]]//input | //input[@name='amount' or @type='number']"
    ),
    categorySelect: By.xpath(
      "//div[./label[contains(., 'Category')]]//select | //select[@id='category' or @name='category']"
    ),
    descriptionInput: By.xpath(
      "//div[./label[contains(., 'Description') or contains(., 'Memo') or contains(., 'Purpose')]]//input | //input[@name='description']"
    ),
    continueButton: By.xpath(
      "//button[@type='submit' and (contains(., 'Continue to Verify') or contains(., 'Continue'))]"
    ),

    // Verification Step
    verificationCard: By.xpath(
      "//h2[contains(., 'Verify') or contains(., 'Verification')]"
    ),
    confirmButton: By.xpath(
      "//button[contains(., 'Confirm & Submit') or contains(., 'Confirm')]"
    ),

    // Receipt Step
    receiptCard: By.xpath(
      "//h2[contains(., 'Submitted') or contains(., 'Successful') or contains(., 'Completed') or contains(., 'Receipt')]"
    ),
    receiptStatusBadge: By.xpath(
      "//*[contains(@class, 'StatusBadge') or contains(@class, 'rounded')]"
    ),
    referenceCodeText: By.xpath("//*[contains(text(), 'RB') or contains(text(), 'TXN')]"),

    // History Page
    historyFilterForm: By.xpath("//form[contains(., 'Filter Transactions')]"),
    filterTypeSelect: By.xpath(
      "//div[./label[contains(., 'Transaction Type')]]//select | //select[@name='type']"
    ),
    filterStatusSelect: By.xpath(
      "//div[./label[contains(., 'Status')]]//select | //select[@name='status']"
    ),
    applyFiltersButton: By.xpath("//button[contains(., 'Apply Filters')]"),
    historyTable: By.xpath('//table'),
    firstRow: By.xpath("//tbody/tr[td and not(contains(., 'No transactions'))][1]"),

    // Detail Modal
    modalTitle: By.xpath(
      "//div[@role='dialog']//*[contains(text(), 'Transaction Receipt') or contains(text(), 'Digital ledger')] | //div[@role='dialog']"
    ),
  };

  async gotoTransfer(baseUrl = 'http://localhost:3001') {
    await this.driver.get(`${baseUrl}/transfer`);
    await this.driver.wait(until.elementLocated(this.locators.continueButton), 5000);
  }

  async gotoHistory(baseUrl = 'http://localhost:3001') {
    await this.driver.get(`${baseUrl}/history`);
    await this.driver.wait(until.elementLocated(this.locators.historyTable), 5000);
  }

  async selectTab(tabName) {
    const tabLocator = tabName.toLowerCase().includes('withdraw')
      ? this.locators.withdrawalTab
      : this.locators.transferTab;
    const tabEl = await this.driver.wait(until.elementLocated(tabLocator), 5000);
    await tabEl.click();
    await this.driver.sleep(300);
  }

  async fillTransferDetails({ destinationAccountNumber, amount, category, description }) {
    if (destinationAccountNumber !== undefined) {
      const destInput = await this.driver.wait(
        until.elementLocated(this.locators.destinationAccountInput),
        5000
      );
      await destInput.clear();
      await destInput.sendKeys(destinationAccountNumber);
    }
    if (amount !== undefined) {
      const amtInput = await this.driver.wait(
        until.elementLocated(this.locators.amountInput),
        5000
      );
      await amtInput.clear();
      await amtInput.sendKeys(amount);
    }
    if (category !== undefined) {
      const catSelect = await this.driver.wait(
        until.elementLocated(this.locators.categorySelect),
        5000
      );
      try {
        const option = await catSelect.findElement(
          By.xpath(`.//option[@value='${category}' or contains(text(), '${category}')]`)
        );
        await option.click();
      } catch {
        await catSelect.sendKeys(category);
      }
    }
    if (description !== undefined) {
      const descInput = await this.driver.wait(
        until.elementLocated(this.locators.descriptionInput),
        5000
      );
      await descInput.clear();
      await descInput.sendKeys(description);
    }
  }

  async fillWithdrawalDetails({ withdrawalMethod, amount, category, description }) {
    if (withdrawalMethod !== undefined) {
      const methodSelect = await this.driver.wait(
        until.elementLocated(this.locators.withdrawalMethodSelect),
        5000
      );
      try {
        const option = await methodSelect.findElement(
          By.xpath(
            `.//option[@value='${withdrawalMethod}' or contains(text(), '${withdrawalMethod}')]`
          )
        );
        await option.click();
      } catch {
        await methodSelect.sendKeys(withdrawalMethod);
      }
    }
    if (amount !== undefined) {
      const amtInput = await this.driver.wait(
        until.elementLocated(this.locators.amountInput),
        5000
      );
      await amtInput.clear();
      await amtInput.sendKeys(amount);
    }
    if (category !== undefined) {
      const catSelect = await this.driver.wait(
        until.elementLocated(this.locators.categorySelect),
        5000
      );
      try {
        const option = await catSelect.findElement(
          By.xpath(`.//option[@value='${category}' or contains(text(), '${category}')]`)
        );
        await option.click();
      } catch {
        await catSelect.sendKeys(category);
      }
    }
    if (description !== undefined) {
      const descInput = await this.driver.wait(
        until.elementLocated(this.locators.descriptionInput),
        5000
      );
      await descInput.clear();
      await descInput.sendKeys(description);
    }
  }

  async clickContinue() {
    const btn = await this.driver.findElement(this.locators.continueButton);
    await btn.click();
  }

  async isVerificationDisplayed() {
    const card = await this.driver.wait(
      until.elementLocated(this.locators.verificationCard),
      5000
    );
    return await card.isDisplayed();
  }

  async confirmTransaction() {
    const btn = await this.driver.wait(
      until.elementLocated(this.locators.confirmButton),
      5000
    );
    await btn.click();
  }

  async isReceiptDisplayed() {
    const card = await this.driver.wait(
      until.elementLocated(this.locators.receiptCard),
      5000
    );
    return await card.isDisplayed();
  }

  async hasErrorMessage(messageText) {
    const errorEl = await this.driver.wait(
      until.elementLocated(By.xpath(`//*[contains(text(), '${messageText}')]`)),
      3000
    );
    return await errorEl.isDisplayed();
  }

  async filterTransactions({ type, status }) {
    if (type) {
      const typeEl = await this.driver.wait(
        until.elementLocated(this.locators.filterTypeSelect),
        5000
      );
      await typeEl.sendKeys(type);
    }
    if (status) {
      const statusEl = await this.driver.wait(
        until.elementLocated(this.locators.filterStatusSelect),
        5000
      );
      await statusEl.sendKeys(status);
    }
  }

  async applyFilters() {
    const btn = await this.driver.findElement(this.locators.applyFiltersButton);
    await btn.click();
  }

  async clickFirstLedgerRow() {
    const row = await this.driver.wait(
      until.elementLocated(this.locators.firstRow),
      10000
    );
    await this.driver.wait(until.elementIsVisible(row), 5000);
    await this.driver.sleep(800);
    await row.click();
  }

  async isDetailModalDisplayed() {
    const modal = await this.driver.wait(
      until.elementLocated(this.locators.modalTitle),
      5000
    );
    return await modal.isDisplayed();
  }
}
