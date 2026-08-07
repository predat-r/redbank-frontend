const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAdminUser(values, { includePassword = false } = {}) {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const phoneNumber = values.phoneNumber.trim();
  const address = values.address.trim();

  if (name.length < 2 || name.length > 150) {
    errors.name = 'Name must be between 2 and 150 characters.';
  }
  if (!emailPattern.test(email)) errors.email = 'Enter a valid email address.';
  if (phoneNumber.length < 6 || phoneNumber.length > 20) {
    errors.phoneNumber = 'Phone number must be between 6 and 20 characters.';
  }
  if (address.length < 5 || address.length > 500) {
    errors.address = 'Address must be between 5 and 500 characters.';
  }
  if (includePassword) {
    if (values.password.length < 8 || values.password.length > 100) {
      errors.password = 'Password must be between 8 and 100 characters.';
    }
    if (values.confirmPassword !== values.password) {
      errors.confirmPassword = 'Passwords do not match.';
    }
  }

  return errors;
}

export function adminUserPayload(values, { includePassword = false } = {}) {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    phoneNumber: values.phoneNumber.trim(),
    address: values.address.trim(),
    ...(includePassword ? { password: values.password } : {}),
  };
}
