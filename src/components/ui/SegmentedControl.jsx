export const SegmentedControl = ({ options = [], value, onChange, className = '' }) => {
  return (
    <div
      className={`inline-flex items-center p-1 bg-neutral-100 rounded-full border border-neutral-200 select-none ${className}`}
      role="tablist"
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange && onChange(option.value)}
            className={`
              h-8 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300
              ${
                isSelected
                  ? 'bg-slate-600 text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-200/50'
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
