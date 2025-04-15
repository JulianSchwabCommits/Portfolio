import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggle_theme: () => void;
  set_theme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, set_theme] = useState<Theme>('dark');

  useEffect(() => {
    const saved_theme = localStorage.getItem('theme') as Theme | null;
    if (saved_theme) {
      set_theme(saved_theme);
    }
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    } else {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle_theme = () => {
    set_theme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle_theme, set_theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const use_theme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('use_theme must be used within a ThemeProvider');
  }
  return context;
}; 