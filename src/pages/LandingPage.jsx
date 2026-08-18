import { useEffect } from 'react';
import Lenis from 'lenis';
import { LandingNav } from '../features/landing/components/LandingNav.jsx';
import { Hero } from '../features/landing/components/Hero.jsx';
import { FeatureGrid } from '../features/landing/components/FeatureGrid.jsx';
import { ShowcaseRow } from '../features/landing/components/ShowcaseRow.jsx';
import { StatsBand } from '../features/landing/components/StatsBand.jsx';
import { CtaBand } from '../features/landing/components/CtaBand.jsx';
import { LandingFooter } from '../features/landing/components/LandingFooter.jsx';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth.js';
import { LoadingState } from '../components/ui/LoadingState.jsx';
import { useTheme } from '../hooks/useTheme.js';

export function LandingPage() {
  const { isAuthenticated, isInitializing, hasRole } = useAuth();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('light');
  }, [setTheme]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  if (isInitializing) {
    return (
      <main className="mx-auto flex min-h-screen items-center justify-center px-6 py-16">
        <LoadingState label="Loading" />
      </main>
    );
  }

  // Redirect authenticated users to their respective dashboards instead of showing the landing page
  if (isAuthenticated) {
    if (hasRole('ROLE_ADMIN')) {
      return <Navigate to="/admin" replace />;
    }
    if (hasRole('ROLE_ACCOUNT_HOLDER')) {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/registration-status" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 font-sans selection:bg-primary-500/30">
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <FeatureGrid />

        {/* Product Showcase */}
        <div id="product">
          <ShowcaseRow
            title="A comprehensive view of your finances"
            description="Your Dashboard provides a high-level summary of your total balance, monthly income, and expenses, all at a glance. See where your money is going instantly."
            imagePath=""
            reverse={false}
          />
          <ShowcaseRow
            title="Instant Fund Transfers"
            description="Send money to anyone, anywhere, at any time. Our intuitive transfer flow makes paying friends or moving funds between accounts as simple as sending a text."
            imagePath=""
            reverse={true}
          />
          <ShowcaseRow
            title="Ask RedAssist"
            description="Have a question about your spending? Just ask RedAssist, our AI-powered financial companion. Get personalized insights and answers based on your transaction history."
            imagePath=""
            reverse={false}
          />
        </div>

        <StatsBand />
        <CtaBand />
      </main>
      <LandingFooter />
    </div>
  );
}
