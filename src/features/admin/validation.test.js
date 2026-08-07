import { describe, expect, test } from 'vitest';
import { adminUserPayload, validateAdminUser } from './validation.js';

const validValues = {
  name: '  Amina Khan  ',
  email: '  amina@example.com  ',
  phoneNumber: '  +923001234567  ',
  address: '  12 Bank Street  ',
  password: 'secure-password',
  confirmPassword: 'secure-password',
};

describe('admin user validation', () => {
  test('validates the OpenAPI constraints for creation', () => {
    expect(validateAdminUser(validValues, { includePassword: true })).toEqual({});
    expect(
      validateAdminUser(
        {
          ...validValues,
          name: 'A',
          email: 'invalid',
          phoneNumber: '123',
          address: 'tiny',
          password: 'short',
          confirmPassword: 'different',
        },
        { includePassword: true }
      )
    ).toEqual({
      name: 'Name must be between 2 and 150 characters.',
      email: 'Enter a valid email address.',
      phoneNumber: 'Phone number must be between 6 and 20 characters.',
      address: 'Address must be between 5 and 500 characters.',
      password: 'Password must be between 8 and 100 characters.',
      confirmPassword: 'Passwords do not match.',
    });
  });

  test('trims write payloads and omits passwords during editing', () => {
    expect(adminUserPayload(validValues)).toEqual({
      name: 'Amina Khan',
      email: 'amina@example.com',
      phoneNumber: '+923001234567',
      address: '12 Bank Street',
    });
    expect(adminUserPayload(validValues, { includePassword: true })).toEqual({
      name: 'Amina Khan',
      email: 'amina@example.com',
      phoneNumber: '+923001234567',
      address: '12 Bank Street',
      password: 'secure-password',
    });
  });
});
