import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-landing-bg py-32 text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <motion.div
          animate={{ scale: [1, 1.02, 1], opacity: [0.5, 0.6, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div
            className="h-[600px] w-[800px]"
            style={{
              background: `radial-gradient(circle at center, rgba(165, 50, 42, 0.3) 0%, transparent 60%)`,
              filter: 'blur(60px)',
            }}
          />
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4">
        <h2 className="font-display text-4xl font-bold tracking-tight text-landing-text-hi sm:text-5xl">
          Ready to take control?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-landing-text-mid">
          Join thousands of users who have transformed their financial lives with RedBank.
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            to="/register"
            className="rounded-full bg-landing-cta-bg px-8 py-4 text-lg font-semibold text-landing-cta-text transition-transform hover:scale-105 active:scale-95"
          >
            Create free account
          </Link>
        </div>
      </div>
    </section>
  );
}
