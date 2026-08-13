import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert } from '../../components/ui/Alert.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { useRegister } from '../../features/auth/auth.queries.js';
import { useAuth } from '../../features/auth/useAuth.js';
import { validateRegistration } from '../../features/auth/validation.js';

const initialValues = {
  name: '',
  email: '',
  phoneNumber: '',
  address: '',
  password: '',
  confirmPassword: '',
  confirmedInformation: false,
};

export function RegisterPage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registration, setRegistration] = useState(null);
  const registerMutation = useRegister();
  const { establishSession } = useAuth();

  function updateField(event) {
    const { checked, name, type, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    registerMutation.reset();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateRegistration(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const response = await registerMutation.mutateAsync({
        name: values.name.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber.trim(),
        address: values.address.trim(),
        password: values.password,
      });
      establishSession(response.tokens);
      setRegistration(response);
    } catch {
      // Mutation state renders the normalized API error.
    }
  }

  if (registration) {
    return (
      <div className="py-4 text-center">
        <StatusBadge status={registration.status} />
        <h1 className="mt-5 text-2xl font-bold text-[#22262F]">
          Your registration is under review
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#707886]">
          We received the application for {registration.email}. An administrator will
          review it before account access is activated.
        </p>
        <Link
          className="mt-6 inline-flex min-h-11 items-center font-semibold text-[#89221C] hover:underline"
          to="/registration-status"
        >
          Check registration status
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#22262F]">Create your account</h1>
        <p className="mt-2 text-sm text-[#707886]">
          Submit your details for secure review.
        </p>
      </div>

      {registerMutation.isError && (
        <div className="mb-5">
          <Alert tone="error">{registerMutation.error.message}</Alert>
        </div>
      )}

      <form noValidate onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            autoComplete="name"
            error={errors.name}
            label="Full name"
            name="name"
            onChange={updateField}
            value={values.name}
          />
          <Input
            autoComplete="email"
            error={errors.email}
            label="Email"
            name="email"
            onChange={updateField}
            type="email"
            value={values.email}
          />
          <Input
            autoComplete="tel"
            error={errors.phoneNumber}
            label="Phone number"
            name="phoneNumber"
            onChange={updateField}
            type="tel"
            value={values.phoneNumber}
          />
          <Input
            autoComplete="street-address"
            containerClassName="md:col-span-2"
            error={errors.address}
            label="Address"
            maxLength={500}
            name="address"
            onChange={updateField}
            value={values.address}
          />
          <Input
            autoComplete="new-password"
            error={errors.password}
            helperText="Use 8–100 characters."
            label="Password"
            name="password"
            onChange={updateField}
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            action={
              <button
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="rounded p-1 text-neutral-500 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-300"
                onClick={() => setShowPassword((visible) => !visible)}
                type="button"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            }
          />
          <Input
            autoComplete="new-password"
            error={errors.confirmPassword}
            label="Confirm password"
            name="confirmPassword"
            onChange={updateField}
            type={showConfirmPassword ? 'text' : 'password'}
            value={values.confirmPassword}
            action={
              <button
                aria-label={
                  showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                }
                className="rounded p-1 text-neutral-500 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-300"
                onClick={() => setShowConfirmPassword((visible) => !visible)}
                type="button"
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            }
          />
        </div>

        <div className="mt-5">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-[#4E5563]">
            <input
              checked={values.confirmedInformation}
              className="mt-0.5 size-5 accent-[#89221C]"
              name="confirmedInformation"
              onChange={updateField}
              type="checkbox"
            />
            <span>I confirm that the information provided is accurate.</span>
          </label>
          {errors.confirmedInformation && (
            <p className="mt-1.5 text-[13px] text-[#D64545]">
              {errors.confirmedInformation}
            </p>
          )}
        </div>

        <Button
          className="mt-6"
          fullWidth
          loading={registerMutation.isPending}
          size="lg"
          type="submit"
        >
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#707886]">
        Already registered?{' '}
        <Link className="font-semibold text-[#89221C] hover:underline" to="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
