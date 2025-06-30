import axios from 'axios';

const BASE_URL = "http://localhost:8080/authentication";

const authApiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

interface SignupData {
    fname: string;
    lname: string;
    userCode: string;
    email: string;
    phone: number;
    password: string;
}

interface LoginData {
    userCode: string;
    password: string;
}

interface LoginResponse {
    message: string;
    token: string;
    role: string;
    userCode: string;
    name: string;
}

interface OtpData {
    email: string;
    otp: string;
}

interface ResetPasswordData {
    email: string;
    newPassword: string;
    confirmPassword: string;
}

export const signup = async (signupData: SignupData) => {
    try {
        const response = await authApiClient.post('/signup', signupData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const login = async (loginData: LoginData): Promise<LoginResponse> => {
    try {
        const response = await authApiClient.post('/login', loginData);
        
        // Store the JWT token and user info in localStorage
        if (response.data.token) {
            localStorage.setItem('jwtToken', response.data.token);
            localStorage.setItem('userRole', response.data.role);
            localStorage.setItem('userCode', response.data.userCode);
            localStorage.setItem('userName', response.data.name);
        }
        
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const requestOtp = async (requestOtpData: string) => {
    try {
        const response = await authApiClient.post('/request-otp', requestOtpData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const verifyOtp = async (verifyOtpData: OtpData) => {
    try {
        const response = await authApiClient.post('/verify-otp', verifyOtpData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const resetPassword = async (resetData: ResetPasswordData) => {
    try {
        const response = await authApiClient.post('/reset-password', resetData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Authentication utility functions
export const authUtils = {
    logout: () => {
        // Clear all stored authentication data
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userCode');
        localStorage.removeItem('userName');
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('jwtToken');
    },

    getCurrentUser: () => {
        return {
            userCode: localStorage.getItem('userCode'),
            role: localStorage.getItem('userRole'),
            name: localStorage.getItem('userName'),
            token: localStorage.getItem('jwtToken')
        };
    },

    getAuthHeader: () => {
        const token = localStorage.getItem('jwtToken');
        return token ? `Bearer ${token}` : '';
    }
};
