﻿const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5009';

export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: `${API_BASE_URL}/api/auth/register`,
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        LOGOUT: `${API_BASE_URL}/api/auth/logout`,
        CURRENT_USER: `${API_BASE_URL}/api/auth/current-user`,
        CHECK_AUTH: `${API_BASE_URL}/api/auth/check-auth`,
    },
    PROPERTIES: {
        BASE: `${API_BASE_URL}/api/properties`,
        BY_ID: (id: string) => `${API_BASE_URL}/api/properties/${id}`,
        API: `${API_BASE_URL}/api/propertiesapi`,
    },
    USERS: {
        BASE: `${API_BASE_URL}/api/users`,
        BY_ID: (id: string) => `${API_BASE_URL}/api/users/${id}`,
    },
};

export const getFetchOptions = (options: RequestInit = {}): RequestInit => {
    return {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };
};

export const authService = {
    register: async (data: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string;
        password: string;
        confirmPassword: string;
    }) => {
        const response = await fetch(
            API_ENDPOINTS.AUTH.REGISTER,
            getFetchOptions({
                method: 'POST',
                body: JSON.stringify(data),
            })
        );
        return response.json();
    },

    login: async (data: {
        email: string;
        password: string;
        rememberMe?: boolean;
    }) => {
        const response = await fetch(
            API_ENDPOINTS.AUTH.LOGIN,
            getFetchOptions({
                method: 'POST',
                body: JSON.stringify(data),
            })
        );
        return response.json();
    },

    logout: async () => {
        const response = await fetch(
            API_ENDPOINTS.AUTH.LOGOUT,
            getFetchOptions({
                method: 'POST',
            })
        );
        return response.json();
    },

    getCurrentUser: async () => {
        const response = await fetch(
            API_ENDPOINTS.AUTH.CURRENT_USER,
            getFetchOptions()
        );
        return response.json();
    },

    checkAuth: async () => {
        const response = await fetch(
            API_ENDPOINTS.AUTH.CHECK_AUTH,
            getFetchOptions()
        );
        return response.json();
    },
};

