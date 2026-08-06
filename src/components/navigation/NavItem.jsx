export const NavItem = ({
  icon: Icon,
  label,
  active = false,
  collapsed = false,
  onClick,
  badge,
}) => {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`
        w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-120 relative group select-none text-left rounded-lg
        ${
          active
            ? 'bg-primary-50 text-primary-600 font-semibold'
            : 'text-neutral-600 hover:bg-slate-50 hover:text-neutral-800'
        }
        ${collapsed ? 'justify-center px-2' : ''}
      `}
    >
      {/* Active Left Rail Indicator */}
      {active && (
        <span className="absolute left-0 top-1 bottom-1 w-1 bg-primary-600 rounded-r-full" />
      )}

      {Icon && (
        <Icon
          className={`w-5 h-5 shrink-0 transition-colors ${
            active ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'
          }`}
        />
      )}

      {!collapsed && <span className="truncate flex-1">{label}</span>}

      {!collapsed && badge && (
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
          {badge}
        </span>
      )}
    </button>
  );
};
