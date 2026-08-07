import { ArrowLeftRight, ClipboardCheck, Landmark, RefreshCw, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert } from '../../components/ui/Alert.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card, StatCard } from '../../components/ui/Card.jsx';
import { useAdminOverview } from '../../features/admin/admin.queries.js';

const summaryCards = [
  {
    key: 'registrations',
    label: 'Pending registrations',
    href: '/admin/registrations',
    icon: ClipboardCheck,
    subtext: 'Awaiting review',
  },
  {
    key: 'users',
    label: 'Total users',
    href: '/admin/users',
    icon: Users,
    subtext: 'Registered users',
  },
  {
    key: 'accounts',
    label: 'Total accounts',
    href: '/admin/accounts',
    icon: Landmark,
    subtext: 'Account holders',
  },
  {
    key: 'transactions',
    label: 'Total transactions',
    href: '/admin/transactions',
    icon: ArrowLeftRight,
    subtext: 'Recorded transactions',
  },
];

const quickLinks = [
  {
    title: 'Review registrations',
    description: 'Approve or reject pending account applications.',
    href: '/admin/registrations',
    icon: ClipboardCheck,
  },
  {
    title: 'Manage account holders',
    description: 'Review users and their linked bank accounts.',
    href: '/admin/accounts',
    icon: Users,
  },
  {
    title: 'Browse transactions',
    description: 'Inspect transaction activity across RedBank.',
    href: '/admin/transactions',
    icon: ArrowLeftRight,
  },
];

export function AdminOverviewPage() {
  const overview = useAdminOverview();

  return (
    <div className="space-y-7">
      <header>
        <p className="text-sm font-semibold text-primary-600">Administration</p>
        <h1 className="mt-1 text-2xl font-bold text-neutral-800 sm:text-3xl">
          Admin overview
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-500">
          Monitor registrations, users, accounts, and transaction activity.
        </p>
      </header>

      {overview.isError && (
        <Alert tone="error">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <span>
              {overview.error?.message || 'Some dashboard totals could not be loaded.'}
            </span>
            <Button
              icon={RefreshCw}
              onClick={() => overview.refetch()}
              size="sm"
              variant="outline"
            >
              Retry
            </Button>
          </div>
        </Alert>
      )}

      <section
        aria-label="Admin totals"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {summaryCards.map((card) => (
          <Link
            className="rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
            key={card.key}
            to={card.href}
          >
            <StatCard
              className="h-full hover:border-neutral-300 hover:shadow-lg"
              icon={card.icon}
              label={card.label}
              subtext={card.subtext}
              value={
                overview.counts[card.key] ?? (overview.isLoading ? '…' : 'Unavailable')
              }
            />
          </Link>
        ))}
      </section>

      <section aria-labelledby="quick-actions-heading">
        <div className="mb-4">
          <h2
            className="text-lg font-semibold text-neutral-800"
            id="quick-actions-heading"
          >
            Quick actions
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Go directly to common administration tasks.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {quickLinks.map(({ title, description, href, icon: Icon }) => (
            <Link
              className="rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
              key={href}
              to={href}
            >
              <Card className="h-full hover:border-neutral-300 hover:shadow-lg">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                  <Icon aria-hidden="true" className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold text-neutral-800">{title}</h3>
                <p className="mt-1 text-sm leading-5 text-neutral-500">{description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
