const styles = {
  error: 'border-[#D64545] bg-[#FCEAE8] text-[#8F2929]',
  info: 'border-[#2E6FBA] bg-[#E8F1FC] text-[#245992]',
  success: 'border-[#1E8E5A] bg-[#E6F6EF] text-[#176F47]',
  warning: 'border-[#C97A1A] bg-[#FEF3E2] text-[#8A5311]',
};

export function Alert({ children, tone = 'info' }) {
  return (
    <div
      className={`rounded-lg border-l-4 px-4 py-3 text-sm ${styles[tone]}`}
      role="alert"
    >
      {children}
    </div>
  );
}
