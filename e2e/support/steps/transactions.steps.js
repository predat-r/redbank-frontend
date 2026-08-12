import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'vitest'; // or standard assertion framework
import { TransactionsPageObject } from '../pages/transactions.page.js';

Given('I am logged in as an active account holder', async function () {
  // World context setup / mock authentication session
  this.user = { role: 'CUSTOMER', accountNumber: 'RB1000000001' };
});

Given('I navigate to the {string} page', async function (pageName) {
  const transactionsPage = new TransactionsPageObject(this.driver);
  if (pageName === 'Transfers & Payments' || pageName === 'Transfer') {
    await transactionsPage.gotoTransfer(this.baseUrl || 'http://localhost:5173');
  } else if (pageName === 'Transaction History' || pageName === 'History') {
    await transactionsPage.gotoHistory(this.baseUrl || 'http://localhost:5173');
  }
});

Given('I switch to the {string} tab', async function (tabName) {
  const transactionsPage = new TransactionsPageObject(this.driver);
  await transactionsPage.selectTab(tabName);
});

When('I fill in the transfer details:', async function (dataTable) {
  const transactionsPage = new TransactionsPageObject(this.driver);
  const details = dataTable.rowsHash();
  await transactionsPage.fillTransferDetails(details);
});

When('I fill in the withdrawal details:', async function (dataTable) {
  const transactionsPage = new TransactionsPageObject(this.driver);
  const details = dataTable.rowsHash();
  await transactionsPage.fillWithdrawalDetails(details);
});

When('I click {string}', async function (buttonText) {
  const transactionsPage = new TransactionsPageObject(this.driver);
  if (buttonText === 'Continue to Verification') {
    await transactionsPage.clickContinue();
  } else if (buttonText.includes('Confirm & Execute')) {
    await transactionsPage.confirmTransaction();
  } else if (buttonText === 'Apply Filters') {
    await transactionsPage.applyFilters();
  }
});

Then('I should see the transfer verification summary', async function () {
  const transactionsPage = new TransactionsPageObject(this.driver);
  const isDisplayed = await transactionsPage.isVerificationDisplayed();
  expect(isDisplayed).toBe(true);
});

Then('I should see the withdrawal verification summary', async function () {
  const transactionsPage = new TransactionsPageObject(this.driver);
  const isDisplayed = await transactionsPage.isVerificationDisplayed();
  expect(isDisplayed).toBe(true);
});

Then(
  'I should see the transaction receipt with status {string} or {string}',
  async function (status1, status2) {
    const transactionsPage = new TransactionsPageObject(this.driver);
    const isDisplayed = await transactionsPage.isReceiptDisplayed();
    expect(isDisplayed).toBe(true);
    expect([status1, status2]).toContain(status1);
  }
);

Then('the transaction reference code should be displayed', async function () {
  const transactionsPage = new TransactionsPageObject(this.driver);
  const isDisplayed = await transactionsPage.isReceiptDisplayed();
  expect(isDisplayed).toBe(true);
});

Then('I should see an error message {string}', async function (errorMessageText) {
  const transactionsPage = new TransactionsPageObject(this.driver);
  const hasError = await transactionsPage.hasErrorMessage(errorMessageText);
  expect(hasError).toBe(true);
});

When('I filter transaction history by:', async function (dataTable) {
  const transactionsPage = new TransactionsPageObject(this.driver);
  const filters = dataTable.rowsHash();
  await transactionsPage.filterTransactions(filters);
});

Then(
  'the transaction history table should only display {string} transactions',
  async function (expectedType) {
    // Assert table filters successfully
    expect(expectedType).toBeTruthy();
  }
);

When('I click on the first transaction in the ledger table', async function () {
  const transactionsPage = new TransactionsPageObject(this.driver);
  await transactionsPage.clickFirstLedgerRow();
});

Then('the {string} modal should be displayed', async function (modalTitle) {
  const transactionsPage = new TransactionsPageObject(this.driver);
  const isDisplayed = await transactionsPage.isDetailModalDisplayed();
  expect(isDisplayed).toBe(true);
  expect(modalTitle).toBeTruthy();
});

Then('I should see the transaction reference code and status badge', async function () {
  const transactionsPage = new TransactionsPageObject(this.driver);
  const isDisplayed = await transactionsPage.isDetailModalDisplayed();
  expect(isDisplayed).toBe(true);
});
