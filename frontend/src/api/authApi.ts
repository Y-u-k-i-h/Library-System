import axios from 'axios';

const BASE_URL = "http://localhost:8080/authentication";
const API_BASE_URL = "http://localhost:8080/api";

const authApiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

// Create a separate client for authenticated API calls
const userApiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

// Add interceptor for user API client to include JWT token
userApiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

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

export interface UserProfile {
    id: number;
    user_id: number;
    userCode: string;
    fname: string;
    lname: string;
    email: string;
    phone: number;
    role: string;
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
            localStorage.setItem('userId', response.data.userId);
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

export const getCurrentUserProfile = async (): Promise<UserProfile> => {
    try {
        // Try the primary user profile endpoint
        try {
            const response = await userApiClient.get('/users/me');
            console.log('Successfully fetched profile from /users/me');
            return response.data;
        } catch (primaryError: any) {
            console.log('Primary endpoint failed, trying alternative...');
            
            // Try the alternative profile endpoint
            const response = await userApiClient.get('/users/profile');
            console.log('Successfully fetched profile from /users/profile');
            return response.data;
        }
    } catch (error: any) {
        console.error('All user profile endpoints failed:', error);
        
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('Authentication failed, user may need to login again');
        }
        
        throw error;
    }
};

// Fallback method to get basic profile info from localStorage
export const getCurrentUserProfileFromStorage = (): Partial<UserProfile> => {
    const userCode = localStorage.getItem('userCode');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    
    if (!userCode || !userName) {
        throw new Error('No user data found in storage');
    }
    
    // Parse the name if it contains both first and last name
    const nameParts = userName.split(' ');
    const fname = nameParts[0] || '';
    const lname = nameParts.slice(1).join(' ') || '';
    
    return {
        userCode,
        fname,
        lname,
        role: userRole || 'student',
        user_id: userId ? parseInt(userId) : 0,
        // Note: ID, email, and phone are not available from storage
    };
};
