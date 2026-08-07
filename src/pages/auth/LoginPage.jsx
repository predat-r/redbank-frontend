import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert } from '../../components/ui/Alert.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { useLogin } from '../../features/auth/auth.queries.js';
import { decodeJwt, getRolesFromClaims } from '../../features/auth/jwt.js';
import { useAuth } from '../../features/auth/useAuth.js';
import { validateLogin } from '../../features/auth/validation.js';

const initialValues = { email: '', password: '' };

export function LoginPage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [showRecoveryNote, setShowRecoveryNote] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
  const { establishSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function updateField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    loginMutation.reset();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateLogin(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const tokens = await loginMutation.mutateAsync({
        email: values.email.trim(),
        password: values.password,
      });
      establishSession(tokens);
      const roles = getRolesFromClaims(decodeJwt(tokens.accessToken));

      const intendedPath = location.state?.from?.pathname;
      if (intendedPath && intendedPath !== '/login') {
        navigate(intendedPath, { replace: true });
      } else if (roles.includes('ROLE_ADMIN')) {
        navigate('/admin/registrations', { replace: true });
      } else if (roles.includes('ROLE_ACCOUNT_HOLDER')) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/registration-status', { replace: true });
      }
    } catch {
      // Mutation state renders the normalized API error.
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#22262F]">Welcome back</h1>
        <p className="mt-2 text-sm text-[#707886]">
          Sign in to access your RedBank account.
        </p>
      </div>

      {loginMutation.isError && (
        <div className="mb-5">
          <Alert tone="error">{loginMutation.error.message}</Alert>
        </div>
      )}
      {showRecoveryNote && (
        <div className="mb-5">
          <Alert tone="info">
            Password recovery is not available yet. Please contact your administrator for
            help.
          </Alert>
        </div>
      )}

      <form noValidate onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            autoComplete="email"
            error={errors.email}
            label="Email"
            name="email"
            onChange={updateField}
            placeholder="you@example.com"
            type="email"
            value={values.email}
          />
          <Input
            autoComplete="current-password"
            error={errors.password}
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
        </div>

        <div className="mt-3 text-right">
          <button
            className="min-h-11 text-sm font-semibold text-[#89221C] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D97771]"
            onClick={() => setShowRecoveryNote(true)}
            type="button"
          >
            Forgot password?
          </button>
        </div>

        <Button
          className="mt-5"
          fullWidth
          loading={loginMutation.isPending}
          size="lg"
          type="submit"
        >
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#707886]">
        New to RedBank?{' '}
        <Link className="font-semibold text-[#89221C] hover:underline" to="/register">
          Create an account
        </Link>
      </p>
    </div>
  );
}
