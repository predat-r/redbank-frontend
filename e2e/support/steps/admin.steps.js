import { Then, When } from '@cucumber/cucumber';

Then('the admin overview should be displayed', async function () {
  await this.pages.admin.waitForHeading('Admin overview');
});

Then('the admin navigation should be displayed', async function () {
  await this.pages.admin.waitForNavigation();
});

When('the admin user opens the {string} module', async function (module) {
  await this.pages.admin.openModule(module);
});

Then('the {string} admin page should be displayed', async function (heading) {
  await this.pages.admin.waitForHeading(heading);
});

When('the admin user opens the first account balance', async function () {
  await this.pages.admin.openFirstAccountBalance();
});

Then('the account balance page should be displayed', async function () {
  await this.pages.admin.waitForHeading('Account balance');
});
