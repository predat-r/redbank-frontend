import { Given, Then, When } from '@cucumber/cucumber';
import { By, until } from 'selenium-webdriver';

Given('the user is on the registration page', async function () {
  await this.pages.registration.open();
});

When('the user submits valid registration details', async function () {
  this.registration = registrationDetails();
  await this.pages.registration.submitRegistration(this.registration);
});

When(
  'the user submits registration details with an invalid email address',
  async function () {
    const details = registrationDetails({ email: 'not-an-email' });
    await this.pages.registration.submitRegistration(details);
  }
);

When('the user submits registration details with a short password', async function () {
  const details = registrationDetails({ password: 'short', confirmPassword: 'short' });
  await this.pages.registration.submitRegistration(details);
});

When(
  'the user submits registration details with mismatched passwords',
  async function () {
    const details = registrationDetails({ confirmPassword: 'different-password' });
    await this.pages.registration.submitRegistration(details);
  }
);

When(
  'the user submits otherwise valid registration details without confirming the information',
  async function () {
    await this.pages.registration.submitRegistration(registrationDetails(), {
      acceptTerms: false,
    });
  }
);

When(
  'the user submits registration details using an existing email address',
  async function () {
    const email = process.env.E2E_EMAIL;
    if (!email)
      throw new Error('Set E2E_EMAIL in .env.e2e to run the duplicate-email scenario.');
    await this.pages.registration.submitRegistration(registrationDetails({ email }));
  }
);

Given('the applicant is on the registration page', async function () {
  await this.pages.registration.open();
});

When('the applicant submits unique valid registration details', async function () {
  this.registration = registrationDetails();
  await this.pages.registration.submitRegistration(this.registration);
  await this.pages.registration.waitForPendingReview();
});

When('the admin approves the applicant registration', async function () {
  const { E2E_ADMIN_EMAIL: email, E2E_ADMIN_PASSWORD: password } = process.env;
  if (!email || !password) {
    throw new Error('Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env.e2e.');
  }

  await this.pages.login.signOut();
  await this.pages.login.waitForLoginPage();
  await this.pages.login.login(email, password);
  await this.driver.wait(until.urlContains('/admin'));
  await this.pages.adminRegistrations.open();
  await this.pages.adminRegistrations.approveRegistration(this.registration.email);
});

When('the approved applicant logs in', async function () {
  await this.pages.login.signOut();
  await this.pages.login.waitForLoginPage();
  await this.pages.login.login(this.registration.email, this.registration.password);
});

When('the user submits the empty registration form', async function () {
  await this.pages.registration.submitEmptyForm();
});

Then('the registration validation errors should be displayed', async function () {
  await this.pages.registration.waitForValidationErrors();
  const invalidFields = await this.driver.findElements(By.css('[aria-invalid="true"]'));
  if (!invalidFields.length) throw new Error('Expected registration validation errors.');
});

Then('the registration should be shown as under review', async function () {
  await this.pages.registration.waitForPendingReview();
});

Then('the registration status should be shown as under review', async function () {
  await this.driver.wait(until.urlContains('/registration-status'));
  await this.pages.registration.waitForPendingReview();
});

Then('the registration error {string} should be displayed', async function (message) {
  await this.pages.registration.waitForError(message);
});

Then('a registration error should be displayed', async function () {
  await this.pages.registration.waitForServerError();
});

function registrationDetails(overrides = {}) {
  const password = process.env.E2E_REGISTRATION_PASSWORD || 'registration-password';
  const identity = uniqueIdentity();
  return {
    name: `${process.env.E2E_REGISTRATION_NAME || 'E2E Test User'} ${identity.suffix}`,
    email: identity.email,
    phoneNumber: identity.phoneNumber,
    address: `${process.env.E2E_REGISTRATION_ADDRESS || 'E2E Test Address'} ${identity.suffix}`,
    password,
    confirmPassword: password,
    ...overrides,
  };
}

function uniqueIdentity() {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1_000_000)}`;
  const configured = process.env.E2E_REGISTRATION_EMAIL;
  const [localPart = 'e2e-user', domain = 'example.com'] = configured?.split('@') || [];
  const phonePrefix = process.env.E2E_REGISTRATION_PHONE_PREFIX || '03';
  const phoneNumber = `${phonePrefix}${suffix.slice(-9)}`;

  return {
    suffix,
    email: `${localPart}+${suffix}@${domain}`,
    phoneNumber,
  };
}
