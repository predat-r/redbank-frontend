import { createContext, useContext } from 'react';

const defaultContext = {
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
};

export const ThemeContext = createContext(defaultContext);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context || defaultContext;
};
