const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(values) {
  const errors = {};
  if (!values.email.trim()) errors.email = 'Email is required.';
  else if (!emailPattern.test(values.email))
    errors.email = 'Enter a valid email address.';
  if (!values.password) errors.password = 'Password is required.';
  return errors;
}

export function validateRegistration(values) {
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
  if (values.password.length < 8 || values.password.length > 100) {
    errors.password = 'Password must be between 8 and 100 characters.';
  }
  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  if (!values.acceptedTerms)
    errors.acceptedTerms = 'You must accept the terms to continue.';

  return errors;
}
