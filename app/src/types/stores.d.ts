/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "*/store/useAuthStore" {
  interface AuthStore {
    user: any;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    setAuth: (user: any, token: string, refreshToken: string) => void;
    logout: () => void;
    updateUser: (user: any) => void;
  }
  const useAuthStore: {
    <T>(selector: (state: AuthStore) => T): T;
    (): AuthStore;
  };
  export { useAuthStore };
}

declare module "*/store/useThemeStore" {
  interface ThemeStore {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    toggleTheme: () => void;
  }
  const useThemeStore: {
    <T>(selector: (state: ThemeStore) => T): T;
    (): ThemeStore;
  };
  export { useThemeStore };
}

declare module "*/api/client" {
  import { AxiosInstance } from 'axios';
  const api: AxiosInstance;
  export default api;
}

declare module "*/components/GlassPanel" {
  import { ReactNode } from 'react';
  interface GlassPanelProps {
    children: ReactNode;
    className?: string;
  }
  export const GlassPanel: (props: GlassPanelProps) => JSX.Element;
}
