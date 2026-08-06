export const Card = ({
  children,
  className = '',
  compact = false,
  onClick,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-neutral-0 border border-neutral-200 rounded-xl shadow-md transition-all duration-120
        ${compact ? 'p-4' : 'p-4 sm:p-6'}
        ${hoverable ? 'hover:border-neutral-300 hover:shadow-lg cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const HeroCard = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`
        bg-gradient-to-br from-neutral-0 to-slate-50 border border-neutral-200 rounded-2xl shadow-md p-6 sm:p-8 transition-all duration-120
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const StatCard = ({
  icon: Icon,
  iconBgColor = 'bg-primary-50 text-primary-600',
  label,
  value,
  subtext,
  className = '',
  ...props
}) => {
  return (
    <Card className={`flex flex-col gap-3 ${className}`} {...props}>
      <div className="flex items-center justify-between">
        {Icon && (
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBgColor}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
        {label && (
          <span className="text-xs uppercase font-semibold text-neutral-500 tracking-wider">
            {label}
          </span>
        )}
      </div>
      <div>
        <div className="text-xl sm:text-2xl font-bold text-neutral-800 tabular-nums">
          {value}
        </div>
        {subtext && <div className="text-xs text-neutral-500 mt-1">{subtext}</div>}
      </div>
    </Card>
  );
};
