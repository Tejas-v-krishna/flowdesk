import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AppState {
  isInitialLoadingComplete: boolean;
  setInitialLoadingComplete: (value: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isInitialLoadingComplete: false,
      setInitialLoadingComplete: (value) => set({ isInitialLoadingComplete: value }),
    }),
    {
      name: "flowdesk-app-state",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
