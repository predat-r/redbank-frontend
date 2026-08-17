import { motion, useReducedMotion } from 'framer-motion';

export function GlowBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : { scale: [1, 1.05, 1], x: [0, 8, -8, 0], y: [0, -12, 12, 0] }
        }
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/2 top-0 h-[900px] w-full max-w-[1400px] -translate-x-1/2 opacity-70"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 50% 20%, var(--color-primary-500) 0%, transparent 80%),
              radial-gradient(ellipse 70% 50% at 50% 80%, var(--color-slate-600) 0%, transparent 80%)
            `,
            filter: 'blur(80px)',
          }}
        />
      </motion.div>
    </div>
  );
}
