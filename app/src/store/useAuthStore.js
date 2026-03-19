import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,

            setAuth: (user, token, refreshToken) =>
                set({ user, token, refreshToken, isAuthenticated: !!token }),

            logout: () =>
                set({ user: null, token: null, refreshToken: null, isAuthenticated: false }),

            updateUser: (user) => set({ user }),
        }),
        {
            name: 'flowdesk-auth',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
