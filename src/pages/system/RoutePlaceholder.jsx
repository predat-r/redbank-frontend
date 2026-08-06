import { Link } from 'react-router-dom';

export function RoutePlaceholder({ title, message }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-4">
      <section className="w-full max-w-lg rounded-xl border border-[#DEE2E8] bg-white p-6 text-center shadow-[0_4px_12px_rgba(20,23,28,0.08)]">
        <h1 className="text-2xl font-bold text-[#22262F]">{title}</h1>
        <p className="mt-3 text-sm text-[#707886]">{message}</p>
        <Link className="mt-5 inline-block text-sm font-semibold text-[#89221C]" to="/">
          Return home
        </Link>
      </section>
    </main>
  );
}
