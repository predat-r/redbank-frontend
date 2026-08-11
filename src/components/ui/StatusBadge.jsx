import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Info,
  ShieldCheck,
  User,
  RotateCcw,
  AlertTriangle,
  Flame,
  ShieldAlert,
} from 'lucide-react';

export const StatusBadge = ({
  status,
  label,
  showIcon = true,
  className = '',
  title,
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
          tooltip: 'Your transaction is currently undergoing security review.',
        };

      case 'REJECTED':
      case 'FAILED':
      case 'DECLINED':
        return {
          bg: 'bg-error-50 text-error-600',
          icon: XCircle,
          defaultLabel: status || 'Failed',
        };

      case 'CANCELLED':
        return {
          bg: 'bg-slate-100 text-slate-600 border border-slate-200/60',
          icon: XCircle,
          defaultLabel: 'Cancelled',
        };

      case 'REVERSED':
        return {
          bg: 'bg-purple-50 text-purple-600 border border-purple-200/60',
          icon: RotateCcw,
          defaultLabel: 'Reversed',
          tooltip: 'Transaction was reversed and funds refunded.',
        };

      case 'FROZEN':
        return {
          bg: 'bg-warning-50 text-warning-600',
          icon: AlertCircle,
          defaultLabel: 'Frozen',
        };

      case 'DEACTIVATED':
      case 'CLOSED':
        return {
          bg: 'bg-slate-100 text-slate-600',
          icon: XCircle,
          defaultLabel: normalizedStatus === 'DEACTIVATED' ? 'Deactivated' : 'Closed',
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

      case 'RISK_HIGH':
      case 'HIGH':
        return {
          bg: 'bg-amber-50 text-amber-700 border border-amber-200/60 font-semibold',
          icon: AlertTriangle,
          defaultLabel: 'High Risk',
        };

      case 'RISK_CRITICAL':
      case 'CRITICAL':
        return {
          bg: 'bg-rose-50 text-rose-700 border border-rose-200/60 font-semibold',
          icon: Flame,
          defaultLabel: 'Critical Risk',
        };

      case 'RISK_MEDIUM':
      case 'MEDIUM':
        return {
          bg: 'bg-blue-50 text-blue-700 border border-blue-200/60',
          icon: ShieldAlert,
          defaultLabel: 'Medium Risk',
        };

      case 'RISK_LOW':
      case 'LOW':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
          icon: ShieldCheck,
          defaultLabel: 'Low Risk',
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
      title={title || style.tooltip}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold select-none ${style.bg} ${className}`}
      {...props}
    >
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span>{displayText}</span>
    </span>
  );
};
