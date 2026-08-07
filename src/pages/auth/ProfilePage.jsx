import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Phone,
  MapPin,
  Mail,
  Calendar,
  LogOut,
  UserCheck,
  Save,
  Snowflake,
  UserX,
  AlertOctagon,
} from 'lucide-react';
import { AppShell } from '../../layouts/AppShell.jsx';
import { AdminLayout } from '../../layouts/AdminLayout.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Alert } from '../../components/ui/Alert.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { useToast } from '../../hooks/useToast.js';
import { useChangePassword, useLogout } from '../../features/auth/auth.queries.js';
import { validatePasswordChange } from '../../features/auth/validation.js';
import { useAuth } from '../../features/auth/useAuth.js';

const initialPasswordValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export function ProfilePage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const auth = useAuth();

  // User Profile State based on OpenAPI schemas
  const [profile, setProfile] = useState({
    name: auth?.claims?.sub || 'Alexander Wright',
    email: auth?.claims?.email || 'alexander.wright@example.com',
    phoneNumber: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Springfield, OR 97477',
    status: 'ACTIVE',
    role: auth?.roles?.[0] || 'ROLE_ACCOUNT_HOLDER',
    createdAt: '2026-01-15T09:00:00Z',
  });

  const [activeTab, setActiveTab] = useState('details');
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  // Edit Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: profile.name,
    phoneNumber: profile.phoneNumber,
    address: profile.address,
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const confirmFreeze = () => {
    setProfile((prev) => ({ ...prev, status: 'FROZEN' }));
    setIsFreezeModalOpen(false);
    addToast({
      type: 'warning',
      title: 'Account Frozen',
      message: 'Your account has been temporarily frozen. Outgoing transfers are locked.',
    });
  };

  const confirmDeactivate = () => {
    setProfile((prev) => ({ ...prev, status: 'DEACTIVATED' }));
    setIsDeactivateModalOpen(false);
    addToast({
      type: 'error',
      title: 'Account Deactivated',
      message: 'Your account has been deactivated.',
    });
  };

  // Password Form State
  const [passwordValues, setPasswordValues] = useState(initialPasswordValues);
  const [passwordErrors, setPasswordErrors] = useState({});
  const changePasswordMutation = useChangePassword();
  const logoutMutation = useLogout();

  function handleProfileChange(e) {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSaveProfile(e) {
    e.preventDefault();
    setIsSavingProfile(true);

    setTimeout(() => {
      setProfile((prev) => ({
        ...prev,
        name: profileForm.name,
        phoneNumber: profileForm.phoneNumber,
        address: profileForm.address,
      }));
      setIsSavingProfile(false);
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your personal details have been saved successfully.',
      });
    }, 400);
  }

  function updatePasswordFields(e) {
    const { name, value } = e.target;
    setPasswordValues((current) => ({ ...current, [name]: value }));
    setPasswordErrors((current) => ({ ...current, [name]: undefined }));
    changePasswordMutation.reset();
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    const nextErrors = validatePasswordChange(passwordValues);
    setPasswordErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordValues.currentPassword,
        newPassword: passwordValues.newPassword,
      });
      setPasswordValues(initialPasswordValues);
      addToast({
        type: 'success',
        title: 'Password Updated',
        message: 'Your new password is now active.',
      });
    } catch {
      // Error handled by mutation state
    }
  }

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSettled: () => navigate('/login', { replace: true }),
    });
  }

  const Shell = profile.role === 'ROLE_ADMIN' ? AdminLayout : AppShell;

  return (
    <Shell
      activePath="/profile"
      user={{ name: profile.name, email: profile.email, role: profile.role }}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-neutral-800 tracking-tight">
              My Profile & Account Settings
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Manage your personal information, contact preferences, and security
              credentials.
            </p>
          </div>
          <Button
            variant="outline"
            icon={LogOut}
            loading={logoutMutation.isPending}
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </div>

        {/* User Profile Banner Hero Card */}
        <Card className="p-6 bg-gradient-to-r from-neutral-0 via-slate-50 to-neutral-0 border border-neutral-200 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-600 text-white font-bold text-xl flex items-center justify-center shadow-md shrink-0">
                {profile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-neutral-800">{profile.name}</h2>
                  <StatusBadge status={profile.status} />
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    {profile.role === 'ROLE_ADMIN' ? 'Administrator' : 'Account Holder'}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-neutral-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {profile.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Member since{' '}
                    {new Date(profile.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Sub-Tabs Control */}
        <div className="border-b border-neutral-200">
          <nav className="flex space-x-6" aria-label="Profile Tabs">
            <button
              onClick={() => setActiveTab('details')}
              className={`
                flex items-center gap-2 py-3 px-1 text-sm font-semibold border-b-2 transition-all select-none
                ${
                  activeTab === 'details'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }
              `}
            >
              <UserCheck className="w-4 h-4" />
              Personal Profile
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`
                flex items-center gap-2 py-3 px-1 text-sm font-semibold border-b-2 transition-all select-none
                ${
                  activeTab === 'security'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }
              `}
            >
              <KeyRound className="w-4 h-4" />
              Password & Security
            </button>
          </nav>
        </div>

        {/* Tab 1: Personal Profile Details & Edit */}
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-8 p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <div>
                  <h3 className="text-base font-bold text-neutral-800">
                    Edit Personal Information
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Update your contact details and physical address for account
                    notifications
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    prefix={<User className="w-4 h-4" />}
                    required
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    value={profile.email}
                    disabled
                    helperText="Primary email cannot be changed directly"
                    prefix={<Mail className="w-4 h-4" />}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    name="phoneNumber"
                    value={profileForm.phoneNumber}
                    onChange={handleProfileChange}
                    prefix={<Phone className="w-4 h-4" />}
                  />
                  <Input
                    label="Physical Address"
                    name="address"
                    value={profileForm.address}
                    onChange={handleProfileChange}
                    prefix={<MapPin className="w-4 h-4" />}
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    icon={Save}
                    loading={isSavingProfile}
                  >
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            </Card>

            {/* Profile Overview Sidebar Card */}
            <Card className="lg:col-span-4 p-6 space-y-6 h-fit">
              <div>
                <h3 className="text-base font-bold text-neutral-800 pb-3 border-b border-neutral-200">
                  Account Summary
                </h3>

                <div className="space-y-3 text-xs sm:text-sm mt-3">
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500">Account Status</span>
                    <StatusBadge status={profile.status} />
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500">Registration Date</span>
                    <span className="font-mono text-neutral-700">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Safety & Danger Controls */}
              <div className="pt-4 border-t border-neutral-200 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Account Safety Controls
                </h4>

                <Button
                  variant="outline"
                  icon={Snowflake}
                  onClick={() => setIsFreezeModalOpen(true)}
                  fullWidth
                  className="justify-start border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  Freeze Account
                </Button>

                <Button
                  variant="danger"
                  icon={UserX}
                  onClick={() => setIsDeactivateModalOpen(true)}
                  fullWidth
                  className="justify-start"
                >
                  Deactivate Account
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 2: Password & Security Form */}
        {activeTab === 'security' && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <Card className="p-6">
              <div className="mb-6 flex items-center gap-3 pb-4 border-b border-neutral-200">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary-50 text-primary-600 shrink-0">
                  <KeyRound className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-neutral-800">
                    Change Account Password
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Confirm your current password to set a new password
                  </p>
                </div>
              </div>

              {changePasswordMutation.isError && (
                <div className="mb-5">
                  <Alert tone="error">{changePasswordMutation.error.message}</Alert>
                </div>
              )}

              <form className="space-y-4" noValidate onSubmit={handlePasswordSubmit}>
                <Input
                  autoComplete="current-password"
                  error={passwordErrors.currentPassword}
                  label="Current password"
                  name="currentPassword"
                  onChange={updatePasswordFields}
                  type="password"
                  value={passwordValues.currentPassword}
                />
                <Input
                  autoComplete="new-password"
                  error={passwordErrors.newPassword}
                  helperText="Use 8–100 characters and choose a strong combination."
                  label="New password"
                  name="newPassword"
                  onChange={updatePasswordFields}
                  type="password"
                  value={passwordValues.newPassword}
                />
                <Input
                  autoComplete="new-password"
                  error={passwordErrors.confirmPassword}
                  label="Confirm new password"
                  name="confirmPassword"
                  onChange={updatePasswordFields}
                  type="password"
                  value={passwordValues.confirmPassword}
                />
                <div className="pt-2">
                  <Button
                    fullWidth
                    loading={changePasswordMutation.isPending}
                    size="lg"
                    type="submit"
                    variant="primary"
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </Card>

            {/* Security Best Practices Card */}
            <Card className="h-fit p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-200">
                <ShieldCheck className="size-6 text-success-600" aria-hidden="true" />
                <h2 className="text-base font-bold text-neutral-800">Security Tips</h2>
              </div>
              <ul className="space-y-4 text-xs sm:text-sm leading-5 text-neutral-600">
                <li className="flex gap-3">
                  <LockKeyhole className="mt-0.5 size-4 shrink-0 text-slate-400" />
                  Use a unique password not shared with other accounts.
                </li>
                <li className="flex gap-3">
                  <LockKeyhole className="mt-0.5 size-4 shrink-0 text-slate-400" />
                  Never share your credentials or login verification details.
                </li>
                <li className="flex gap-3">
                  <LockKeyhole className="mt-0.5 size-4 shrink-0 text-slate-400" />
                  Always sign out when using a shared or public browser.
                </li>
              </ul>
            </Card>
          </div>
        )}

        {/* Freeze Confirmation Modal */}
        <Modal
          isOpen={isFreezeModalOpen}
          onClose={() => setIsFreezeModalOpen(false)}
          title="Freeze Account"
          subtitle="Temporary security lock request"
        >
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-800 leading-relaxed flex items-start gap-3">
              <Snowflake className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                Freezing your account will temporarily block all outgoing wire transfers,
                cash withdrawals, and new transactions until unfrozen.
              </div>
            </div>

            <p className="text-sm text-neutral-700 font-medium">
              Are you sure you want to freeze your account?
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsFreezeModalOpen(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={confirmFreeze}
                fullWidth
                className="bg-amber-600 hover:bg-amber-700 text-white border-none"
              >
                Confirm Freeze
              </Button>
            </div>
          </div>
        </Modal>

        {/* Deactivate Confirmation Modal */}
        <Modal
          isOpen={isDeactivateModalOpen}
          onClose={() => setIsDeactivateModalOpen(false)}
          title="Deactivate Account"
          subtitle="Permanent account closure request"
        >
          <div className="space-y-4">
            <div className="p-4 bg-error-50 border border-error-600/30 rounded-xl text-xs text-error-600 leading-relaxed flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-error-600 shrink-0 mt-0.5" />
              <div>
                Deactivating your account will permanently disable your online banking
                profile and revoke access to all registered banking services.
              </div>
            </div>

            <p className="text-sm text-neutral-700 font-medium">
              Are you sure you want to deactivate your profile?
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsDeactivateModalOpen(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDeactivate} fullWidth>
                Confirm Deactivation
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Shell>
  );
}

export default ProfilePage;
