import { Given, Then, When } from '@cucumber/cucumber';
import { By, until } from 'selenium-webdriver';

Given('the user is on the login page', async function () {
  await this.pages.login.open();
});

Given('the user is logged in with valid credentials', async function () {
  await this.pages.login.open();
  await loginWithConfiguredCredentials(this);
  await this.pages.login.waitForDashboard();
});

When('the user logs in with valid credentials', async function () {
  await loginWithConfiguredCredentials(this);
});

When('the user refreshes the page', async function () {
  await this.pages.login.refresh();
});

When('the user signs out', async function () {
  await this.pages.login.signOut();
});

When('the user submits invalid credentials', async function () {
  await this.pages.login.submitInvalidCredentials();
});

When('the user submits the empty login form', async function () {
  await this.pages.login.submitEmptyForm();
});

Given('the user opens the dashboard without logging in', async function () {
  await this.driver.get(`${this.baseUrl}/dashboard`);
});

Given('the admin user is on the login page', async function () {
  await this.pages.login.open();
});

Given('the admin user is logged in with valid credentials', async function () {
  await this.pages.login.open();
  const { E2E_ADMIN_EMAIL: email, E2E_ADMIN_PASSWORD: password } = process.env;
  if (!email || !password) {
    throw new Error('Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env.e2e.');
  }
  await this.pages.login.login(email, password);
  await this.pages.admin.waitForHeading();
});

When('the admin user logs in with valid credentials', async function () {
  const { E2E_ADMIN_EMAIL: email, E2E_ADMIN_PASSWORD: password } = process.env;
  if (!email || !password) {
    throw new Error('Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env.e2e.');
  }
  await this.pages.login.login(email, password);
});

Then('the user should see the account dashboard', async function () {
  await this.pages.login.waitForDashboard();
});

Then('the user should be returned to the login page', async function () {
  await this.pages.login.waitForLoginPage();
});

Then('a login error should be displayed', async function () {
  await this.pages.login.waitForLoginError();
});

Then('the login validation errors should be displayed', async function () {
  await this.driver.wait(until.elementLocated(By.css('[aria-invalid="true"]')));
});

Then('the admin dashboard should be displayed', async function () {
  await this.driver.wait(until.urlContains('/admin'));
});

async function loginWithConfiguredCredentials(world) {
  const { E2E_EMAIL: email, E2E_PASSWORD: password } = process.env;

  if (!email || !password) {
    throw new Error(
      'Create .env.e2e from .env.e2e.example and set E2E_EMAIL and E2E_PASSWORD.'
    );
  }

  await world.pages.login.login(email, password);
}
