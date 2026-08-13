import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  useChatWithRedAssist,
  useMyAccount,
} from '../../features/account/account.queries.js';
import { renderWithProviders } from '../../test/render.jsx';
import { ChatPage } from './ChatPage.jsx';

vi.mock('../../layouts/AppShell', () => ({
  AppShell: ({ children }) => <>{children}</>,
}));
vi.mock('../../features/account/account.queries.js', () => ({
  useChatWithRedAssist: vi.fn(),
  useMyAccount: vi.fn(),
}));

describe('ChatPage', () => {
  const mutate = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    Element.prototype.scrollIntoView = vi.fn();
    useMyAccount.mockReturnValue({ data: { user: { name: 'Amina' } } });
    useChatWithRedAssist.mockReturnValue({ isPending: false, mutate });
  });

  afterEach(() => {
    localStorage.clear();
    delete Element.prototype.scrollIntoView;
  });

  function renderChatPage() {
    return renderWithProviders(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>
    );
  }

  test('shows the empty-chat state and persists a submitted message', async () => {
    const user = userEvent.setup();
    renderChatPage();

    expect(screen.getByText('How can I help you today?')).toBeInTheDocument();
    await user.type(
      screen.getByPlaceholderText('Ask a question...'),
      'What is my balance?'
    );
    await user.click(screen.getByRole('button', { name: /send/i }));

    expect(mutate).toHaveBeenCalledWith(
      { message: 'What is my balance?' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
    expect(screen.getByText('What is my balance?')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('redbank_chat_history'))).toEqual([
      expect.objectContaining({ role: 'user', text: 'What is my balance?' }),
    ]);
  });

  test('renders a structured assistant reply and clarification indicator', async () => {
    const user = userEvent.setup();
    renderChatPage();
    await user.type(screen.getByPlaceholderText('Ask a question...'), 'Show my balance');
    await user.click(screen.getByRole('button', { name: /send/i }));

    const [, callbacks] = mutate.mock.calls[0];
    callbacks.onSuccess({
      reply: '{"reply":"Your balance is $120.00."}',
      needsClarification: true,
    });

    expect(
      await screen.findByText(
        (_, element) =>
          element?.tagName === 'SPAN' &&
          element.textContent === 'Your balance is $120.00.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('$120.00')).toBeInTheDocument();
    expect(screen.getByText('Needs Clarification')).toBeInTheDocument();
  });

  test('shows a failed reply and lets the user retry the preceding message', async () => {
    const user = userEvent.setup();
    renderChatPage();
    await user.type(screen.getByPlaceholderText('Ask a question...'), 'Please help');
    await user.click(screen.getByRole('button', { name: /send/i }));

    const [, callbacks] = mutate.mock.calls[0];
    callbacks.onError();
    await user.click(await screen.findByRole('button', { name: /retry/i }));

    expect(screen.getByPlaceholderText('Ask a question...')).toHaveValue('Please help');
  });

  test('disables the composer while a reply is pending', () => {
    useChatWithRedAssist.mockReturnValue({ isPending: true, mutate });
    renderChatPage();

    expect(screen.getByPlaceholderText('Ask a question...')).toBeDisabled();
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
  });
});
