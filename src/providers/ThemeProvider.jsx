import { useEffect, useState } from 'react';
import { ThemeContext } from '../hooks/useTheme.js';

const STORAGE_KEY = 'redbank-theme';

export const ThemeProvider = ({ children, defaultTheme }) => {
  const [theme, setThemeState] = useState(() => {
    if (defaultTheme === 'dark' || defaultTheme === 'light') {
      return defaultTheme;
    }
    if (typeof window === 'undefined') return 'light';
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    return 'light';
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, [theme, isDark]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
