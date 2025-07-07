import axios from 'axios';

const BASE_URL = "http://localhost:8080/api/admin";

const adminApiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

// Interceptor to add JWT token to all requests
adminApiClient.interceptors.request.use(
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

// Interceptor to handle 401 responses (token expired/invalid)
adminApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Check if we actually have a token - if not, this might be expected
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                console.log('No token found, authentication required');
                return Promise.reject(error);
            }
            
            // Only redirect to login if it's a persistent authentication error
            const errorMessage = error.response?.data?.message || '';
            console.log('401 error received:', errorMessage);
            
            // Be more careful about when to auto-logout
            if (errorMessage.includes('expired') || errorMessage.includes('invalid') || errorMessage.includes('malformed')) {
                console.log('Token is invalid or expired, logging out');
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userCode');
                localStorage.removeItem('userName');
                // Use a slight delay to avoid race conditions
                setTimeout(() => {
                    window.location.href = '/login';
                }, 100);
            } else {
                console.log('Authentication error but not necessarily token expiration:', errorMessage);
                // Don't auto-logout for temporary issues
            }
        }
        return Promise.reject(error);
    }
);

export interface UserSummary {
    id: number;
    firstName: string;
    lastName: string;
    userCode: string;
    role: string;
    borrowedBooksCount: number;
    strikes: number;
}

export const getAllUsers = async (): Promise<UserSummary[]> => {
    try {
        const response = await adminApiClient.get('/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const searchUsers = async (query: string): Promise<UserSummary[]> => {
    try {
        const response = await adminApiClient.get(`/users/search?query=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
};

// Borrowed Books Ledger API
export interface BorrowedBook {
  id: number;
  borrowerName: string;
  borrowerUserCode: string;
  bookTitle: string;
  bookAuthor: string;
  bookIsbn: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: string;
}

export const getAllBorrowedBooks = async (): Promise<BorrowedBook[]> => {
  const response = await adminApiClient.get('/borrowed-books');
  return response.data;
};

export const searchBorrowedBooks = async (query: string): Promise<BorrowedBook[]> => {
  const response = await adminApiClient.get('/borrowed-books/search', {
    params: { query }
  });
  return response.data;
};

// Reserved Books API
export interface ReservedBook {
  id: number;
  userFullName: string;
  userCode: string;
  bookTitle: string;
  bookAuthor: string;
  bookIsbn: string;
  reservationDate: string;
  expiryDate: string | null;
  status: string;
}

export const getAllReservedBooks = async (): Promise<ReservedBook[]> => {
  const response = await adminApiClient.get('/reserved-books');
  return response.data;
};

export const searchReservedBooks = async (query: string): Promise<ReservedBook[]> => {
  const response = await adminApiClient.get('/reserved-books/search', {
    params: { query }
  });
  return response.data;
};
