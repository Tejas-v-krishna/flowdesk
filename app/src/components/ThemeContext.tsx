import { createContext, useContext, useState, type ReactNode } from "react";

interface ThemeCtx {
  isLight: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx>({ isLight: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isLight, setIsLight] = useState(false);
  const toggle = () => setIsLight((v) => !v);
  return (
    <ThemeContext.Provider value={{ isLight, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
