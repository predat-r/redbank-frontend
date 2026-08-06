export function LoadingState({ label = 'Loading' }) {
  return (
    <div aria-label={label} aria-live="polite" className="space-y-3" role="status">
      <span className="sr-only">{label}</span>
      <div className="h-4 w-3/4 animate-pulse rounded bg-[#EEF0F3]" />
      <div className="h-4 w-full animate-pulse rounded bg-[#EEF0F3]" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-[#EEF0F3]" />
    </div>
  );
}
