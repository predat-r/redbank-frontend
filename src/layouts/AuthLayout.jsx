import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-4 py-8 sm:px-6">
      <div className="w-full max-w-2xl">
        <header className="mb-6 text-center">
          <img
            src="/favicon_trans.svg"
            alt="RedBank"
            className="h-18 w-auto mx-auto mb-2 select-none"
          />
          <p className="mt-2 text-sm text-[#707886]">Secure, precise, modern banking</p>
        </header>
        <section className="rounded-2xl border border-[#DEE2E8] bg-white p-4 shadow-[0_12px_32px_rgba(20,23,28,0.12)] sm:p-6 md:p-8">
          <Outlet />
        </section>
      </div>
    </main>
  );
}
