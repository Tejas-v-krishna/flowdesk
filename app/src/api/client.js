import axios from 'axios'
import { useAuthStore } from '../store/useAuthStore'

const api = axios.create({
    // In production (Vercel), VITE_API_URL points to the deployed backend (e.g. Railway).
    // In development, it's empty so we fall back to '/api' which the Vite proxy forwards to localhost:5000.
    baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor for handling 401s (token refresh logic would go here)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle logout or refresh
            useAuthStore.getState().logout()
        }
        return Promise.reject(error)
    }
)

export default api
