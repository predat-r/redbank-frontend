export const SegmentedControl = ({
  options = [],
  value,
  onChange,
  className = '',
  fullWidthOnMobile = true,
}) => {
  return (
    <div
      className={`inline-flex items-center p-1.5 bg-neutral-100/90 border border-neutral-200/80 rounded-2xl select-none ${
        fullWidthOnMobile ? 'w-full sm:w-auto flex' : 'flex'
      } ${className}`}
      role="tablist"
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange && onChange(option.value)}
            className={`
              flex-1 sm:flex-initial h-10 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ease-out flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 cursor-pointer
              ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
              }
            `}
          >
            {Icon && (
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isSelected ? 'text-primary-400' : 'text-neutral-500'
                }`}
              />
            )}
            <span className="truncate">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
