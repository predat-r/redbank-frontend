export function DateTimePicker({ label, name, value = '' }) {
  const [date = '', time = ''] = value.split('T');

  return (
    <fieldset className="flex w-full flex-col gap-1.5">
      <legend className="text-xs font-medium text-neutral-700">{label}</legend>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(6.5rem,0.7fr)] gap-2">
        <input
          aria-label={`${label} date`}
          className="h-11 min-w-0 rounded-lg border border-neutral-200 bg-neutral-0 px-3 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          defaultValue={date}
          name={`${name}Date`}
          type="date"
        />
        <input
          aria-label={`${label} time`}
          className="h-11 min-w-0 rounded-lg border border-neutral-200 bg-neutral-0 px-3 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          defaultValue={time.slice(0, 5)}
          name={`${name}Time`}
          type="time"
        />
      </div>
    </fieldset>
  );
}
