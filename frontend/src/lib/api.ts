const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5009';

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
    INQUIRIES: {
        BASE: `${API_BASE_URL}/api/inquiriesapi`,
        BY_ID: (id: string) => `${API_BASE_URL}/api/inquiriesapi/${id}`,
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

export const propertyService = {
    getProperties: async (params?: {
        searchTerm?: string;
        type?: number;
        status?: number;
        transaction?: number;
        minPrice?: number;
        maxPrice?: number;
        city?: string;
        pageNumber?: number;
        pageSize?: number;
    }) => {
        const queryParams = new URLSearchParams();
        
        if (params) {
            if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
            if (params.type !== undefined && params.type !== null) queryParams.append('type', params.type.toString());
            if (params.status !== undefined && params.status !== null) queryParams.append('status', params.status.toString());
            if (params.transaction !== undefined && params.transaction !== null) queryParams.append('transaction', params.transaction.toString());
            if (params.minPrice !== undefined && params.minPrice !== null) queryParams.append('minPrice', params.minPrice.toString());
            if (params.maxPrice !== undefined && params.maxPrice !== null) queryParams.append('maxPrice', params.maxPrice.toString());
            if (params.city) queryParams.append('city', params.city);
            if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
            if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        }
        
        const url = `${API_ENDPOINTS.PROPERTIES.API}?${queryParams.toString()}`;
        const response = await fetch(url, getFetchOptions());
        
        if (!response.ok) {
            throw new Error('Failed to fetch properties');
        }
        
        return response.json();
    },

    getPropertyById: async (id: number) => {
        const response = await fetch(
            `${API_ENDPOINTS.PROPERTIES.API}/${id}`,
            getFetchOptions()
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch property');
        }
        
        return response.json();
    },

    getFeaturedProperties: async (count: number = 10) => {
        const response = await fetch(
            `${API_ENDPOINTS.PROPERTIES.API}/featured?count=${count}`,
            getFetchOptions()
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch featured properties');
        }
        
        return response.json();
    },
};

export const inquiryService = {
    createInquiry: async (data: {
        propertyId: number;
        message: string;
        phoneNumber: string;
        preferredVisitDate?: string;
    }) => {
        const response = await fetch(
            API_ENDPOINTS.INQUIRIES.BASE,
            getFetchOptions({
                method: 'POST',
                body: JSON.stringify(data),
            })
        );
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create inquiry');
        }
        
        return response.json();
    },

    getInquiries: async (params?: {
        status?: number;
        pageNumber?: number;
        pageSize?: number;
    }) => {
        const queryParams = new URLSearchParams();
        
        if (params) {
            if (params.status !== undefined && params.status !== null) queryParams.append('status', params.status.toString());
            if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
            if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        }
        
        const url = `${API_ENDPOINTS.INQUIRIES.BASE}?${queryParams.toString()}`;
        const response = await fetch(url, getFetchOptions());
        
        if (!response.ok) {
            throw new Error('Failed to fetch inquiries');
        }
        
        return response.json();
    },

    getInquiryById: async (id: number) => {
        const response = await fetch(
            API_ENDPOINTS.INQUIRIES.BY_ID(id.toString()),
            getFetchOptions()
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch inquiry');
        }
        
        return response.json();
    },
};



