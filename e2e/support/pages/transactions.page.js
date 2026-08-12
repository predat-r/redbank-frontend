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
      "//input[preceding-sibling::label[contains(., 'Destination Account')] or @placeholder='e.g. RB1000000001']"
    ),
    withdrawalMethodSelect: By.xpath(
      "//select[preceding-sibling::label[contains(., 'Withdrawal Method')]]"
    ),
    amountInput: By.xpath(
      "//input[@type='number' or preceding-sibling::label[contains(., 'Amount')]]"
    ),
    categorySelect: By.xpath(
      "//select[preceding-sibling::label[contains(., 'Category')]]"
    ),
    descriptionInput: By.xpath(
      "//input[preceding-sibling::label[contains(., 'Memo') or contains(., 'Note')] or @placeholder='e.g. Dinner bill split']"
    ),
    continueButton: By.xpath(
      "//button[@type='submit' and contains(., 'Continue to Verification')]"
    ),

    // Verification Step
    verificationCard: By.xpath(
      "//h2[contains(., 'Verify') or contains(., 'Verification')]"
    ),
    confirmButton: By.xpath("//button[contains(., 'Confirm & Execute')]"),

    // Receipt Step
    receiptCard: By.xpath("//h2[contains(., 'Receipt') or contains(., 'Status')]"),
    receiptStatusBadge: By.xpath(
      "//*[contains(@class, 'StatusBadge') or contains(@class, 'rounded')]"
    ),
    referenceCodeText: By.xpath("//*[contains(text(), 'RB') or contains(text(), 'TXN')]"),

    // History Page
    historyFilterForm: By.xpath("//form[contains(., 'Filter Transactions')]"),
    filterTypeSelect: By.xpath(
      "//select[@name='type' or preceding-sibling::label[contains(., 'Transaction Type')]]"
    ),
    filterStatusSelect: By.xpath(
      "//select[@name='status' or preceding-sibling::label[contains(., 'Status')]]"
    ),
    applyFiltersButton: By.xpath("//button[contains(., 'Apply Filters')]"),
    historyTable: By.xpath('//table'),
    firstRow: By.xpath('//tbody/tr[1]'),

    // Detail Modal
    modalTitle: By.xpath("//*[contains(text(), 'Transaction Receipt')]"),
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
    const tabEl = await this.driver.findElement(tabLocator);
    await tabEl.click();
  }

  async fillTransferDetails({ destinationAccountNumber, amount, category, description }) {
    if (destinationAccountNumber !== undefined) {
      const destInput = await this.driver.findElement(
        this.locators.destinationAccountInput
      );
      await destInput.clear();
      await destInput.sendKeys(destinationAccountNumber);
    }
    if (amount !== undefined) {
      const amtInput = await this.driver.findElement(this.locators.amountInput);
      await amtInput.clear();
      await amtInput.sendKeys(amount);
    }
    if (category !== undefined) {
      const catSelect = await this.driver.findElement(this.locators.categorySelect);
      await catSelect.sendKeys(category);
    }
    if (description !== undefined) {
      const descInput = await this.driver.findElement(this.locators.descriptionInput);
      await descInput.clear();
      await descInput.sendKeys(description);
    }
  }

  async fillWithdrawalDetails({ withdrawalMethod, amount, category, description }) {
    if (withdrawalMethod !== undefined) {
      const methodSelect = await this.driver.findElement(
        this.locators.withdrawalMethodSelect
      );
      await methodSelect.sendKeys(withdrawalMethod);
    }
    if (amount !== undefined) {
      const amtInput = await this.driver.findElement(this.locators.amountInput);
      await amtInput.clear();
      await amtInput.sendKeys(amount);
    }
    if (category !== undefined) {
      const catSelect = await this.driver.findElement(this.locators.categorySelect);
      await catSelect.sendKeys(category);
    }
    if (description !== undefined) {
      const descInput = await this.driver.findElement(this.locators.descriptionInput);
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
      const typeEl = await this.driver.findElement(this.locators.filterTypeSelect);
      await typeEl.sendKeys(type);
    }
    if (status) {
      const statusEl = await this.driver.findElement(this.locators.filterStatusSelect);
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
      5000
    );
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
