import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function CountUpNumber({ end, duration = 1.2 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);

        // ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setValue(Math.floor(easeOut * end));

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="font-sans tabular-nums">
      {value.toLocaleString()}
    </span>
  );
}

const stats = [
  { value: 3000, suffix: '+', label: 'Assets Tracked' },
  { prefix: '$', value: 50, suffix: 'M+', label: 'Transferred' },
  { value: 99, suffix: '.9%', label: 'Uptime' },
];

export function StatsBand() {
  return (
    <section className="bg-neutral-0 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-bold tracking-tight text-primary-600 sm:text-5xl">
                {stat.prefix}
                <CountUpNumber end={stat.value} />
                {stat.suffix}
              </div>
              <div className="mt-2 text-sm font-medium uppercase tracking-wide text-neutral-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
