import { ArrowLeft, KeyRound, LockKeyhole, ShieldCheck, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../../components/ui/Alert.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { SignOutConfirmModal } from '../../components/ui/SignOutConfirmModal.jsx';
import { useToast } from '../../hooks/useToast.js';
import { useChangePassword, useLogout } from '../../features/auth/auth.queries.js';
import { validatePasswordChange } from '../../features/auth/validation.js';
import { useAuth } from '../../features/auth/useAuth.js';

const initialValues = { currentPassword: '', newPassword: '', confirmPassword: '' };

export function SecurityPage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const changePasswordMutation = useChangePassword();
  const logoutMutation = useLogout();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { roles } = useAuth();
  const returnPath = roles?.includes('ROLE_ADMIN') ? '/admin' : '/dashboard';

  function updateField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    changePasswordMutation.reset();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validatePasswordChange(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setValues(initialValues);
      addToast({
        type: 'success',
        title: 'Password updated',
        message: 'Your new password is now active.',
      });
    } catch {
      // Mutation state renders the normalized API error.
    }
  }

  function handleLogoutClick() {
    setShowSignOutModal(true);
  }

  function handleConfirmLogout() {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        navigate('/login', { replace: true });
      },
    });
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <img
              src="/favicon_trans.svg"
              alt="RedBank"
              className="h-9 w-auto object-contain"
            />
            <h1 className="mt-2 text-2xl font-bold text-neutral-800 sm:text-[28px]">
              Password & Security
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Keep your account credentials secure.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              icon={ArrowLeft}
              onClick={() => navigate(returnPath)}
              variant="outline"
            >
              Back to {returnPath === '/admin' ? 'admin' : 'dashboard'}
            </Button>
            <Button
              loading={logoutMutation.isPending}
              onClick={handleLogoutClick}
              variant="danger"
              icon={LogOut}
            >
              Sign Out
            </Button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <KeyRound className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-800">
                  Change password
                </h2>
                <p className="text-xs text-neutral-500">
                  Confirm your current password first.
                </p>
              </div>
            </div>

            {changePasswordMutation.isError && (
              <div className="mb-5">
                <Alert tone="error">{changePasswordMutation.error.message}</Alert>
              </div>
            )}

            <form className="space-y-4" noValidate onSubmit={handleSubmit}>
              <Input
                autoComplete="current-password"
                error={errors.currentPassword}
                label="Current password"
                name="currentPassword"
                onChange={updateField}
                type="password"
                value={values.currentPassword}
              />
              <Input
                autoComplete="new-password"
                error={errors.newPassword}
                helperText="Use 8–100 characters and choose something new."
                label="New password"
                name="newPassword"
                onChange={updateField}
                type="password"
                value={values.newPassword}
              />
              <Input
                autoComplete="new-password"
                error={errors.confirmPassword}
                label="Confirm new password"
                name="confirmPassword"
                onChange={updateField}
                type="password"
                value={values.confirmPassword}
              />
              <Button
                fullWidth
                loading={changePasswordMutation.isPending}
                size="lg"
                type="submit"
              >
                Update Password
              </Button>
            </form>
          </Card>

          <Card className="h-fit">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-6 text-success-600" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-neutral-800">Security tips</h2>
            </div>
            <ul className="mt-5 space-y-4 text-sm leading-5 text-neutral-600">
              <li className="flex gap-3">
                <LockKeyhole className="mt-0.5 size-4 shrink-0 text-slate-400" />
                Use a password you do not use for another service.
              </li>
              <li className="flex gap-3">
                <LockKeyhole className="mt-0.5 size-4 shrink-0 text-slate-400" />
                Never share your password or verification details.
              </li>
              <li className="flex gap-3">
                <LockKeyhole className="mt-0.5 size-4 shrink-0 text-slate-400" />
                Sign out when using a shared or public device.
              </li>
            </ul>
          </Card>
        </div>
      </div>

      <SignOutConfirmModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleConfirmLogout}
        loading={logoutMutation.isPending}
      />
    </main>
  );
}
