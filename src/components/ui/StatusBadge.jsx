import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Info,
  ShieldCheck,
  User,
} from 'lucide-react';

export const StatusBadge = ({
  status,
  label,
  showIcon = true,
  className = '',
  ...props
}) => {
  const normalizedStatus = (status || '').toUpperCase();

  const getBadgeStyle = () => {
    switch (normalizedStatus) {
      case 'ACTIVE':
      case 'COMPLETED':
      case 'SUCCESS':
      case 'APPROVED':
        return {
          bg: 'bg-success-50 text-success-600',
          icon: CheckCircle,
          defaultLabel: status || 'Completed',
        };

      case 'PENDING':
      case 'PENDING_APPROVAL':
      case 'PROCESSING':
      case 'IN_REVIEW':
        return {
          bg: 'bg-warning-50 text-warning-600',
          icon: Clock,
          defaultLabel: status === 'PENDING_APPROVAL' ? 'Pending Approval' : 'Pending',
        };

      case 'REJECTED':
      case 'FAILED':
      case 'CANCELLED':
      case 'DECLINED':
        return {
          bg: 'bg-error-50 text-error-600',
          icon: XCircle,
          defaultLabel: status || 'Failed',
        };

      case 'ROLE_ADMIN':
        return {
          bg: 'bg-primary-50 text-primary-600',
          icon: ShieldCheck,
          defaultLabel: 'Admin',
        };

      case 'ROLE_ACCOUNT_HOLDER':
        return {
          bg: 'bg-slate-50 text-slate-600',
          icon: User,
          defaultLabel: 'Account Holder',
        };

      case 'INFO':
        return {
          bg: 'bg-info-50 text-info-600',
          icon: Info,
          defaultLabel: 'Info',
        };

      default:
        return {
          bg: 'bg-slate-50 text-slate-600',
          icon: AlertCircle,
          defaultLabel: status || 'Unknown',
        };
    }
  };

  const style = getBadgeStyle();
  const IconComponent = style.icon;
  const displayText = label || style.defaultLabel;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold select-none ${style.bg} ${className}`}
      {...props}
    >
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span>{displayText}</span>
    </span>
  );
};
