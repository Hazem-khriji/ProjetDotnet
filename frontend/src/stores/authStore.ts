import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/lib/api';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    roles?: string[];
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    
    setUser: (user: User | null) => void;
    login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; errors?: string[]; message?: string }>;
    register: (data: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string;
        password: string;
        confirmPassword: string;
    }) => Promise<{ success: boolean; errors?: string[]; message?: string }>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            setUser: (user) => {
                set({ 
                    user, 
                    isAuthenticated: !!user,
                    error: null 
                });
            },

            login: async (email, password, rememberMe = false) => {
                set({ isLoading: true, error: null });
                try {
                    const data = await authService.login({ email, password, rememberMe });
                    
                    if (data.success && data.user) {
                        set({ 
                            user: data.user, 
                            isAuthenticated: true, 
                            isLoading: false,
                            error: null
                        });
                        return { success: true };
                    } else {
                        const errorMessage = data.errors?.[0] || data.message || 'Login failed';
                        set({ 
                            error: errorMessage,
                            isLoading: false 
                        });
                        return { 
                            success: false, 
                            errors: data.errors, 
                            message: data.message 
                        };
                    }
                } catch (error) {
                    const errorMessage = 'An error occurred during login';
                    set({ 
                        error: errorMessage,
                        isLoading: false 
                    });
                    return { 
                        success: false, 
                        message: errorMessage 
                    };
                }
            },

            register: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.register(data);
                    
                    if (response.success && response.user) {
                        set({ 
                            user: response.user, 
                            isAuthenticated: true, 
                            isLoading: false,
                            error: null
                        });
                        return { success: true };
                    } else {
                        const errorMessage = response.errors?.[0] || response.message || 'Registration failed';
                        set({ 
                            error: errorMessage,
                            isLoading: false 
                        });
                        return { 
                            success: false, 
                            errors: response.errors, 
                            message: response.message 
                        };
                    }
                } catch (error) {
                    const errorMessage = 'An error occurred during registration';
                    set({ 
                        error: errorMessage,
                        isLoading: false 
                    });
                    return { 
                        success: false, 
                        message: errorMessage 
                    };
                }
            },

            logout: async () => {
                set({ isLoading: true });
                try {
                    await authService.logout();
                } catch (error) {
                    console.error('Logout error:', error);
                } finally {
                    set({ 
                        user: null, 
                        isAuthenticated: false, 
                        isLoading: false,
                        error: null 
                    });
                }
            },

            checkAuth: async () => {
                set({ isLoading: true });
                try {
                    const data = await authService.checkAuth();
                    
                    if (data.success && data.user) {
                        set({ 
                            user: data.user, 
                            isAuthenticated: true, 
                            isLoading: false,
                            error: null
                        });
                    } else {
                        set({ 
                            user: null, 
                            isAuthenticated: false, 
                            isLoading: false,
                            error: null
                        });
                    }
                } catch (error) {
                    set({ 
                        user: null, 
                        isAuthenticated: false, 
                        isLoading: false,
                        error: null
                    });
                }
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ 
                user: state.user,
                isAuthenticated: state.isAuthenticated 
            }),
        }
    )
);

