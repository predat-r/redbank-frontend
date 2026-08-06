export function AdminModulePlaceholder({ title }) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-neutral-0 p-6 shadow-sm">
      <p className="text-sm font-semibold text-primary-600">Administration</p>
      <h1 className="mt-1 text-2xl font-bold text-neutral-800">{title}</h1>
      <p className="mt-2 text-sm text-neutral-500">
        This admin module is included in the next implementation stage.
      </p>
    </section>
  );
}
