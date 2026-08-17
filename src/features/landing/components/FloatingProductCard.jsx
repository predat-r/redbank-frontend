export function FloatingProductCard() {
  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--color-landing-border)] bg-[var(--color-landing-surface)] shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center border-b border-[var(--color-landing-border)] px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-error-600/80" />
          <div className="h-3 w-3 rounded-full bg-warning-600/80" />
          <div className="h-3 w-3 rounded-full bg-success-600/80" />
        </div>
      </div>
      <div className="p-8">
        <div className="text-sm font-medium text-landing-text-low">Total Balance</div>
        <div className="mt-2 font-sans text-4xl font-bold tabular-nums text-landing-text-hi sm:text-5xl">
          $124,562.00
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[var(--color-landing-border)] pt-6 sm:gap-8">
          <div>
            <div className="text-xs font-medium text-landing-text-low">
              Monthly Income
            </div>
            <div className="mt-1 font-sans text-lg font-bold tabular-nums text-success-600">
              +$8,450.00
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-landing-text-low">
              Monthly Expense
            </div>
            <div className="mt-1 font-sans text-lg font-bold tabular-nums text-landing-text-hi">
              -$3,240.00
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
