import { Given, When, Then } from '@cucumber/cucumber';
import { assert } from 'chai';

Given('the user is on the profile page', async function () {
  await this.pages.profile.open();
});

Then('the user should see their profile details', async function () {
  const name = await this.pages.profile.getProfileName();
  assert.isNotNull(name);
});

When('the user updates their personal information', async function () {
  await this.pages.profile.updateProfile('Updated Name', '555-0000', '123 New Address');
});

When('the user switches to the security tab', async function () {
  await this.pages.profile.switchToSecurityTab();
});

When('the user changes their password', async function () {
  const { E2E_PASSWORD: password } = process.env;
  await this.pages.profile.changePassword(
    password,
    'NewValidPass123!',
    'NewValidPass123!'
  );
});

When('the user freezes their account', async function () {
  // Self-heal: if the account is stuck frozen from a previous failed run, unfreeze first
  await this.pages.profile.ensureAccountActive();
  await this.pages.profile.toggleAccountFreeze('Freeze');
});

When('the user unfreezes their account', async function () {
  await this.pages.profile.toggleAccountFreeze('Unfreeze');
});

Then('a success message should be displayed', async function () {
  await this.pages.profile.waitForSuccessToast();
});

When('the user reverts their password back to the original', async function () {
  const { E2E_PASSWORD: password } = process.env;
  await this.pages.profile.changePassword('NewValidPass123!', password, password);
});
