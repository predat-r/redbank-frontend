import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useChatWithRedAssist,
  useMyAccount,
} from '../../features/account/account.queries';
import { AppShell } from '../../layouts/AppShell';
import { Send, Bot, XCircle, RefreshCw, ArrowDown, RotateCcw } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'redbank_chat_history';

const getReplyText = (reply) => {
  if (typeof reply !== 'string') return reply;

  try {
    const parsedReply = JSON.parse(reply);
    return typeof parsedReply?.reply === 'string' ? parsedReply.reply : reply;
  } catch {
    return reply;
  }
};

const formatMessageText = (text, isUser) => {
  if (isUser) return text;

  // Regex for amounts: optional + or -, followed by $, digits, commas, optional decimals.
  const amountRegex = /([+-]?\$\d+(?:,\d{3})*(?:\.\d+)?)/g;
  const parts = text.split(amountRegex);

  return parts.map((part, i) => {
    if (part.match(amountRegex)) {
      const isNegative = part.startsWith('-');
      return (
        <span
          key={i}
          style={{
            backgroundColor: isNegative
              ? 'var(--color-error-50)'
              : 'var(--color-neutral-100)',
            color: isNegative ? 'var(--color-error-600)' : 'var(--color-primary-700)',
            padding: '2px 8px',
            borderRadius: '6px',
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            display: 'inline-block',
          }}
        >
          {part.trim()}
        </span>
      );
    }
    return part;
  });
};

export const ChatPage = () => {
  const navigate = useNavigate();
  const { data: realAccount } = useMyAccount();

  const userProfile = {
    name: realAccount?.user?.name,
    email: realAccount?.user?.email,
    role: realAccount?.user?.role,
  };

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load chat history', e);
    }
    return [];
  });

  const [inputValue, setInputValue] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const chatMutation = useChatWithRedAssist();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chat history', e);
    }
    scrollToBottom();
  }, [messages]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedInput = inputValue.trim();
    if (!trimmedInput || chatMutation.isPending) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: trimmedInput,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    chatMutation.mutate(
      { message: trimmedInput },
      {
        onSuccess: (data) => {
          const aiMsg = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            text: getReplyText(data.reply),
            needsClarification: data.needsClarification,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, aiMsg]);
        },
        onError: () => {
          const errorMsg = {
            id: (Date.now() + 1).toString(),
            role: 'error',
            text: 'I encountered an error trying to send that message.',
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, errorMsg]);
        },
      }
    );
  };

  const handleRetry = (msgText) => {
    setInputValue(msgText);
  };

  const handleClearChat = () => {
    if (messages.length === 0) return;
    setMessages([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear chat history', e);
    }
  };

  return (
    <AppShell activePath="/chat" onNavigate={navigate} user={userProfile}>
      <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[400px] w-full bg-neutral-0 rounded-md border border-neutral-200 shadow-md overflow-hidden relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-0 shrink-0 flex items-center justify-between">
          <h3 className="text-[18px] leading-[26px] font-semibold text-neutral-800 flex items-center gap-2">
            <Bot size={24} strokeWidth={1.75} className="text-slate-600" />
            RedAssist
          </h3>
          <button
            onClick={handleClearChat}
            disabled={messages.length === 0}
            className="p-2 -mr-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear chat"
            aria-label="Clear chat"
          >
            <RotateCcw size={20} strokeWidth={1.75} />
          </button>
        </div>

        {/* Chat Area */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 sm:p-6 bg-neutral-50 flex flex-col gap-4 relative"
        >
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <Bot size={48} strokeWidth={1.75} className="text-neutral-300 mb-4" />
              <h3 className="text-[18px] leading-[26px] font-semibold text-neutral-800 mb-2">
                How can I help you today?
              </h3>
              <p className="text-[13px] leading-[18px] text-neutral-500 max-w-sm">
                I'm RedAssist, your intelligent banking assistant. Ask me about your
                accounts, recent transactions, or navigating the platform.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              const isError = msg.role === 'error';

              // Check if previous message was from the same sender to adjust gap
              const prevMsg = index > 0 ? messages[index - 1] : null;
              const isSameSenderAsPrev = prevMsg && prevMsg.role === msg.role;
              const mtClass = isSameSenderAsPrev ? 'mt-1' : 'mt-4';

              // We only show avatar on the first message of an AI group
              const isFirstInGroup = !isSameSenderAsPrev;

              return (
                <div
                  key={msg.id}
                  className={`flex animate-message-enter ${isUser ? 'justify-end' : 'justify-start'} ${index === 0 ? 'mt-0' : mtClass}`}
                >
                  {/* AI Avatar */}
                  {!isUser && (
                    <div className="w-6 shrink-0 mr-3 flex justify-center">
                      {isFirstInGroup && (
                        <div className="w-6 h-6 rounded-full bg-slate-50 border border-neutral-200 flex items-center justify-center text-slate-600">
                          <Bot size={14} strokeWidth={1.75} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Bubble Container */}
                  <div
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[70%]`}
                  >
                    {!isUser && isFirstInGroup && (
                      <span className="text-[13px] leading-[18px] font-medium text-neutral-700 mb-1">
                        RedAssist
                      </span>
                    )}

                    <div
                      className={`px-4 py-3 rounded-md tabular-nums text-[14px] leading-[20px] font-normal ${
                        isUser
                          ? 'bg-primary-600 text-white rounded-br-[4px]'
                          : isError
                            ? 'bg-error-50 text-error-600 rounded-bl-[4px] border border-error-100 flex items-start gap-2'
                            : 'bg-neutral-100 text-neutral-800 rounded-bl-[4px]'
                      }`}
                    >
                      {isError && (
                        <XCircle
                          size={16}
                          strokeWidth={1.75}
                          className="mt-0.5 shrink-0"
                        />
                      )}
                      <span>{formatMessageText(msg.text, isUser)}</span>
                    </div>

                    {msg.needsClarification && !isUser && (
                      <span className="inline-flex bg-warning-50 text-warning-600 rounded-full px-3 py-1 text-[12px] leading-[16px] font-medium uppercase tracking-[0.04em] mt-2 border border-warning-100">
                        Needs Clarification
                      </span>
                    )}

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[13px] leading-[18px] text-neutral-500 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {isError && prevMsg?.role === 'user' && (
                        <button
                          onClick={() => handleRetry(prevMsg.text)}
                          className="text-[13px] leading-[18px] text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors duration-120 ease-out"
                        >
                          <RefreshCw size={14} strokeWidth={1.75} />
                          Retry
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {chatMutation.isPending && (
            <div className="flex animate-message-enter justify-start mt-4">
              <div className="w-6 shrink-0 mr-3 flex justify-center">
                {(messages.length === 0 ||
                  messages[messages.length - 1].role !== 'ai') && (
                  <div className="w-6 h-6 rounded-full bg-slate-50 border border-neutral-200 flex items-center justify-center text-slate-600">
                    <Bot size={14} strokeWidth={1.75} />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start max-w-[70%]">
                {(messages.length === 0 ||
                  messages[messages.length - 1].role !== 'ai') && (
                  <span className="text-[13px] leading-[18px] font-medium text-neutral-700 mb-1">
                    RedAssist
                  </span>
                )}
                <div className="px-4 py-3 rounded-md bg-neutral-100 rounded-bl-[4px] flex items-center gap-1 h-[44px]">
                  <div
                    className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-typing-dot"
                    style={{ animationDelay: '0ms' }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-typing-dot"
                    style={{ animationDelay: '466ms' }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-typing-dot"
                    style={{ animationDelay: '933ms' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} className="h-px" />
        </div>

        {/* Scroll to latest button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-[80px] left-1/2 -translate-x-1/2 bg-neutral-0 text-slate-600 rounded-full shadow-lg border border-neutral-200 px-4 py-2 flex items-center gap-2 text-[13px] leading-[18px] font-medium animate-in fade-in slide-in-from-bottom-2 z-10 hover:bg-slate-50 transition-colors"
          >
            <ArrowDown size={16} strokeWidth={1.75} />
            Scroll to latest
          </button>
        )}

        {/* Input Area */}
        <div className="p-4 bg-neutral-0 border-t border-neutral-200 shrink-0 relative z-20">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a question..."
                disabled={chatMutation.isPending}
                className="w-full h-[44px] px-3 bg-neutral-0 border border-neutral-200 rounded-sm text-[14px] text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 transition-shadow disabled:bg-neutral-50 disabled:text-neutral-400"
              />
            </div>
            <button
              type="submit"
              disabled={!inputValue.trim() || chatMutation.isPending}
              className="h-[44px] px-5 flex items-center justify-center bg-primary-600 text-white rounded-sm hover:bg-primary-500 active:bg-primary-700 disabled:bg-neutral-100 disabled:text-neutral-400 transition-colors duration-120 ease-out active:scale-98 active:duration-75 font-semibold text-[14px] shrink-0"
            >
              <Send size={20} strokeWidth={1.75} className="mr-2" />
              Send
            </button>
          </form>
        </div>

        <style>{`
          @keyframes messageEnter {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-message-enter {
            animation: messageEnter 200ms cubic-bezier(0.16,1,0.3,1) forwards;
          }
          
          @keyframes typingShimmer {
            0% { opacity: 0.4; }
            50% { opacity: 1; }
            100% { opacity: 0.4; }
          }
          .animate-typing-dot {
            animation: typingShimmer 1.4s linear infinite;
          }
          
          .active\\:scale-98:active:not(:disabled) {
            transform: scale(0.98);
          }
        `}</style>
      </div>
    </AppShell>
  );
};
