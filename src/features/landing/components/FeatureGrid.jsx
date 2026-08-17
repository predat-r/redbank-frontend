import { motion } from 'framer-motion';
import { Send, Clock, MessageSquare, ShieldCheck } from 'lucide-react';

const features = [
  {
    title: 'Fund Transfers',
    description:
      'Send and receive money instantly with zero hidden fees. Global reach, local speed.',
    icon: Send,
  },
  {
    title: 'Real-time History',
    description:
      'Track every transaction as it happens. Categorized, searchable, and always up to date.',
    icon: Clock,
  },
  {
    title: 'Chat with RedAssist',
    description:
      'Your personal AI financial advisor. Ask questions, get insights, and make better decisions.',
    icon: MessageSquare,
  },
  {
    title: 'Bank-grade Security',
    description:
      'Enterprise-level encryption and security protocols keep your money and data safe.',
    icon: ShieldCheck,
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="bg-neutral-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Everything you need in a bank
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
            Powerful features designed to give you complete control over your financial
            life.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="rounded-2xl bg-neutral-0 p-8 shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                  <Icon size={24} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-neutral-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-base text-neutral-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
