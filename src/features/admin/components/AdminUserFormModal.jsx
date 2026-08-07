import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { useCreateAdminUser, useUpdateAdminUser } from '../admin.queries.js';
import { adminUserPayload, validateAdminUser } from '../validation.js';
import { useToast } from '../../../hooks/useToast.js';

function initialValues(user) {
  return {
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    password: '',
    confirmPassword: '',
  };
}

export function AdminUserFormModal({ onClose, user = null }) {
  const isEdit = Boolean(user);
  const [values, setValues] = useState(() => initialValues(user));
  const [errors, setErrors] = useState({});
  const [created, setCreated] = useState(null);
  const createUser = useCreateAdminUser();
  const updateUser = useUpdateAdminUser();
  const mutation = isEdit ? updateUser : createUser;
  const { addToast } = useToast();

  function updateField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    mutation.reset();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateAdminUser(values, { includePassword: !isEdit });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const payload = adminUserPayload(values, { includePassword: !isEdit });
      if (isEdit) {
        await updateUser.mutateAsync({ userId: user.id, payload });
        addToast({
          type: 'success',
          title: 'User updated',
          message: `${payload.name}'s profile was updated.`,
        });
        onClose();
      } else {
        const response = await createUser.mutateAsync(payload);
        setCreated(response);
        addToast({
          type: 'success',
          title: 'Account holder created',
          message: `${response.user.name}'s account is ready.`,
        });
      }
    } catch {
      // Mutation state renders the normalized API error.
    }
  }

  return (
    <Modal
      isOpen
      maxWidth="max-w-2xl"
      onClose={mutation.isPending ? undefined : onClose}
      subtitle={isEdit ? user.email : 'Creates a user and linked bank account'}
      title={isEdit ? 'Edit user' : 'Create account holder'}
    >
      {created ? (
        <div className="space-y-5 text-center">
          <CheckCircle2 className="mx-auto size-12 text-success-600" />
          <div>
            <h4 className="text-lg font-semibold text-neutral-800">
              Account holder created
            </h4>
            <p className="mt-1 text-sm text-neutral-500">{created.user.email}</p>
          </div>
          <dl className="grid gap-3 rounded-xl bg-neutral-50 p-4 text-left sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase text-neutral-500">
                Account number
              </dt>
              <dd className="mt-1 font-mono text-sm text-neutral-800">
                {created.accountHolder.accountNumber}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-neutral-500">
                Currency
              </dt>
              <dd className="mt-1 text-sm text-neutral-800">
                {created.accountHolder.currency}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-neutral-500">
                User status
              </dt>
              <dd className="mt-1">
                <StatusBadge status={created.user.status} />
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-neutral-500">
                Account status
              </dt>
              <dd className="mt-1">
                <StatusBadge status={created.accountHolder.accountStatus} />
              </dd>
            </div>
          </dl>
          <Button onClick={onClose}>Done</Button>
        </div>
      ) : (
        <form className="space-y-5" noValidate onSubmit={handleSubmit}>
          {mutation.isError && <Alert tone="error">{mutation.error.message}</Alert>}
          <div className="grid gap-4 sm:grid-cols-2">
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
              error={errors.address}
              label="Address"
              maxLength={500}
              name="address"
              onChange={updateField}
              value={values.address}
            />
            {!isEdit && (
              <>
                <Input
                  autoComplete="new-password"
                  error={errors.password}
                  helperText="Use 8–100 characters."
                  label="Temporary password"
                  name="password"
                  onChange={updateField}
                  type="password"
                  value={values.password}
                />
                <Input
                  autoComplete="new-password"
                  error={errors.confirmPassword}
                  label="Confirm password"
                  name="confirmPassword"
                  onChange={updateField}
                  type="password"
                  value={values.confirmPassword}
                />
              </>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <Button disabled={mutation.isPending} onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button loading={mutation.isPending} type="submit">
              {isEdit ? 'Save Changes' : 'Create Account Holder'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
