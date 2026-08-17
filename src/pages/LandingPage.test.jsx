import { screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { renderWithProviders } from '../test/render.jsx';
import { LandingPage } from './LandingPage.jsx';

// Mock Lenis as it requires a real browser environment
vi.mock('lenis', () => {
  return {
    default: class Lenis {
      constructor() {
        this.raf = vi.fn();
        this.destroy = vi.fn();
      }
    },
  };
});

// Mock child components to keep the test focused
vi.mock('../features/landing/components/LandingNav.jsx', () => ({
  LandingNav: () => <div data-testid="landing-nav" />,
}));
vi.mock('../features/landing/components/Hero.jsx', () => ({
  Hero: () => <div data-testid="hero" />,
}));
vi.mock('../features/landing/components/FeatureGrid.jsx', () => ({
  FeatureGrid: () => <div data-testid="feature-grid" />,
}));
vi.mock('../features/landing/components/ShowcaseRow.jsx', () => ({
  ShowcaseRow: () => <div data-testid="showcase-row" />,
}));
vi.mock('../features/landing/components/StatsBand.jsx', () => ({
  StatsBand: () => <div data-testid="stats-band" />,
}));
vi.mock('../features/landing/components/CtaBand.jsx', () => ({
  CtaBand: () => <div data-testid="cta-band" />,
}));
vi.mock('../features/landing/components/LandingFooter.jsx', () => ({
  LandingFooter: () => <div data-testid="landing-footer" />,
}));
vi.mock('../components/ui/LoadingState.jsx', () => ({
  LoadingState: () => <div data-testid="loading-state" />,
}));

vi.mock('../features/auth/useAuth.js', () => ({
  useAuth: vi.fn(),
}));
import { useAuth } from '../features/auth/useAuth.js';

function renderComponent() {
  return renderWithProviders(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<div data-testid="admin-page" />} />
        <Route path="/dashboard" element={<div data-testid="dashboard-page" />} />
        <Route
          path="/registration-status"
          element={<div data-testid="registration-status-page" />}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('LandingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state when initializing', () => {
    useAuth.mockReturnValue({ isInitializing: true });
    renderComponent();
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });

  test('redirects to /admin if user is admin', () => {
    useAuth.mockReturnValue({
      isInitializing: false,
      isAuthenticated: true,
      hasRole: (role) => role === 'ROLE_ADMIN',
    });
    renderComponent();
    expect(screen.getByTestId('admin-page')).toBeInTheDocument();
  });

  test('redirects to /dashboard if user is account holder', () => {
    useAuth.mockReturnValue({
      isInitializing: false,
      isAuthenticated: true,
      hasRole: (role) => role === 'ROLE_ACCOUNT_HOLDER',
    });
    renderComponent();
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  test('redirects to /registration-status if user has unknown role', () => {
    useAuth.mockReturnValue({
      isInitializing: false,
      isAuthenticated: true,
      hasRole: () => false,
    });
    renderComponent();
    expect(screen.getByTestId('registration-status-page')).toBeInTheDocument();
  });

  test('renders landing page when not authenticated', () => {
    useAuth.mockReturnValue({
      isInitializing: false,
      isAuthenticated: false,
      hasRole: () => false,
    });
    renderComponent();

    expect(screen.getByTestId('landing-nav')).toBeInTheDocument();
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('feature-grid')).toBeInTheDocument();
    expect(screen.getAllByTestId('showcase-row').length).toBe(3);
    expect(screen.getByTestId('stats-band')).toBeInTheDocument();
    expect(screen.getByTestId('cta-band')).toBeInTheDocument();
    expect(screen.getByTestId('landing-footer')).toBeInTheDocument();
  });
});
