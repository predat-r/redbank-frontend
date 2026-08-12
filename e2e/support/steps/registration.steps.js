import { Given, Then, When } from '@cucumber/cucumber';
import { By } from 'selenium-webdriver';

Given('the user is on the registration page', async function () {
  await this.pages.registration.open();
});

When('the user submits the empty registration form', async function () {
  await this.pages.registration.submitEmptyForm();
});

Then('the registration validation errors should be displayed', async function () {
  await this.pages.registration.waitForValidationErrors();
  const invalidFields = await this.driver.findElements(By.css('[aria-invalid="true"]'));
  if (!invalidFields.length) throw new Error('Expected registration validation errors.');
});
