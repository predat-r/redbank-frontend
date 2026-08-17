import { ArrowRight, Activity, PieChart } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { GlowBackground } from './GlowBackground.jsx';
import { FloatingProductCard } from './FloatingProductCard.jsx';
import { Link } from 'react-router-dom';

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.25 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-landing-bg pt-32 pb-24 text-center">
      <GlowBackground />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 mx-auto max-w-4xl px-4"
      >
        <motion.h1
          variants={itemVariants}
          className="font-display text-4xl font-bold leading-tight tracking-tight text-landing-text-hi sm:text-5xl lg:text-[64px]"
        >
          Bank smarter with <br />
          <span className="bg-gradient-to-r from-primary-400 to-white bg-clip-text text-transparent">
            intelligent finance.
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-6 max-w-[520px] text-lg text-landing-text-mid"
        >
          Manage your wealth, track expenses, and plan for the future with RedBank. Your
          all-in-one financial operating system.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            to="/register"
            className="flex items-center gap-2 rounded-full bg-landing-cta-bg px-8 py-3.5 text-base font-semibold text-landing-cta-text transition-transform hover:scale-105 active:scale-95"
          >
            Start now <ArrowRight size={18} />
          </Link>
          <a
            href="#features"
            className="rounded-full px-6 py-3 text-sm font-medium text-landing-text-mid transition-colors hover:text-landing-text-hi"
          >
            See how it works
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.65, ease: 'easeOut' }}
        className="relative z-10 mx-auto w-full max-w-5xl px-4 mt-20"
      >
        <div className="relative">
          <FloatingProductCard />

          {/* Floating Stat Chips */}
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-12 top-1/4 hidden rounded-2xl border border-[var(--color-landing-border)] bg-[var(--color-landing-surface)] p-4 backdrop-blur-xl lg:block"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-600/20 text-success-600">
                <Activity size={20} />
              </div>
              <div className="text-left">
                <div className="text-xs text-landing-text-low">Monthly Savings</div>
                <div className="font-sans text-sm font-bold tabular-nums text-landing-text-hi">
                  +$2,450.00
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -right-8 bottom-1/4 hidden rounded-2xl border border-[var(--color-landing-border)] bg-[var(--color-landing-surface)] p-4 backdrop-blur-xl lg:block"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/20 text-primary-400">
                <PieChart size={20} />
              </div>
              <div className="text-left">
                <div className="text-xs text-landing-text-low">Expenses</div>
                <div className="font-sans text-sm font-bold tabular-nums text-landing-text-hi">
                  -$1,240.00
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Gradient mask to transition to light mode section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-50 to-transparent" />
    </section>
  );
}
