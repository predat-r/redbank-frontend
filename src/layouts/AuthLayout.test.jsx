import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { AuthLayout } from './AuthLayout.jsx';

describe('AuthLayout', () => {
  test('renders brand context around auth route content', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<p>Login form</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByAltText('RedBank')).toBeInTheDocument();
    expect(screen.getByText('Secure, precise, modern banking')).toBeInTheDocument();
    expect(screen.getByText('Login form')).toBeInTheDocument();
  });
});
