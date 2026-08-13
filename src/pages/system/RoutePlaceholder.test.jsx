import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { RoutePlaceholder } from './RoutePlaceholder.jsx';

describe('RoutePlaceholder', () => {
  test('shows the supplied message and a safe route home link', () => {
    render(
      <MemoryRouter>
        <RoutePlaceholder
          title="Page not found"
          message="The requested page is unavailable."
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByText('The requested page is unavailable.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /return home/i })).toHaveAttribute(
      'href',
      '/'
    );
  });
});
