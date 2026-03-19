import { create } from 'zustand';

interface AppState {
    isInitialLoadingComplete: boolean;
    setInitialLoadingComplete: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    isInitialLoadingComplete: false,
    setInitialLoadingComplete: (value) => set({ isInitialLoadingComplete: value }),
}));
