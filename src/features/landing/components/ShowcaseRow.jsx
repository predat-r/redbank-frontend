import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { Image } from 'lucide-react';

export function ShowcaseRow({ title, description, imagePath, reverse = false }) {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Subtle parallax effect for the image
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={ref} className="overflow-hidden bg-neutral-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`flex flex-col items-center gap-16 md:flex-row ${reverse ? 'md:flex-row-reverse' : ''}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex-1 space-y-6 text-center md:text-left"
          >
            <h2 className="font-display text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {title}
            </h2>
            <p className="text-lg leading-relaxed text-neutral-600">{description}</p>
          </motion.div>

          <motion.div
            style={{ y: shouldReduceMotion ? 0 : y }}
            className="flex-[1.5] w-full"
          >
            <div className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-0 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              {/* Browser Chrome */}
              <div className="flex items-center gap-1.5 border-b border-neutral-100 bg-neutral-50 px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-neutral-300 group-hover:bg-error-500 transition-colors" />
                <div className="h-2.5 w-2.5 rounded-full bg-neutral-300 group-hover:bg-warning-500 transition-colors" />
                <div className="h-2.5 w-2.5 rounded-full bg-neutral-300 group-hover:bg-success-500 transition-colors" />
              </div>

              {/* Image Content */}
              <div className="relative aspect-video w-full bg-neutral-100">
                {imagePath ? (
                  <img
                    src={imagePath}
                    alt={title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-neutral-400">
                    <Image size={48} className="mb-4 opacity-50" />
                    <span className="text-sm font-medium">Screenshot coming soon</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
