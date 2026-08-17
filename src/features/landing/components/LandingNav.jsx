import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';

export function LandingNav() {
  return (
    <motion.nav
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.15, ease: 'easeOut' }}
      className="fixed left-0 right-0 top-6 z-50 mx-auto flex max-w-5xl items-center justify-between rounded-full border border-[var(--color-landing-border)] bg-[var(--color-landing-surface)] px-6 py-3 backdrop-blur-xl"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary-600 font-bold text-white">
          R
        </div>
        <span className="font-display text-lg font-bold text-landing-text-hi">
          RedBank
        </span>
      </div>

      <div className="hidden items-center gap-8 md:flex">
        {['Product', 'Features', 'Pricing', 'Company'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-sm font-medium text-landing-text-mid transition-colors hover:text-landing-text-hi"
          >
            {item}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="hidden text-sm font-medium text-landing-text-mid transition-colors hover:text-landing-text-hi md:block"
        >
          Sign in
        </Link>
        <Link
          to="/register"
          className="rounded-full bg-landing-cta-bg px-5 py-2 text-sm font-semibold text-landing-cta-text transition-transform hover:scale-105 active:scale-95"
        >
          Start now
        </Link>
        <button className="text-landing-text-hi md:hidden">
          <Menu size={24} />
        </button>
      </div>
    </motion.nav>
  );
}
