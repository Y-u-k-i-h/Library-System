import axios from "axios";

const BASE_URL = "http://localhost:8080/api/";

const borrowingApiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

// Interceptor to add JWT token to all requests
borrowingApiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        console.log('Debug - API Request - Token exists:', !!token);
        console.log('Debug - API Request - Request URL:', config.url);
        console.log('Debug - API Request - Request method:', config.method);
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Debug - API Request - Authorization header set');
        } else {
            console.warn('Debug - API Request - No token found in localStorage');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle 401 responses (token expired/invalid)
borrowingApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Only clear localStorage if this is actually a token expiration
            // Don't clear on the first 401 - let the user try again
            console.warn('Debug - API Response - Received 401 error, but keeping token for now');
            console.warn('Debug - API Response - If this persists, the token might be expired');
            
            // TODO: You might want to implement retry logic or show a more specific error
            // For now, we'll just log the warning but not clear the token immediately
        }
        return Promise.reject(error);
    }
);

export interface BorrowingRequest {
    bookId: number;
}

export interface BorrowingDetails {
    id: number;
    book: {
        id: number;
        bookId: number;
        title: string;
        author: string;
        publisher: string;
        isbn: string;
        genre: string;
        availability: boolean;
        book_condition: string;
    };
    borrowDate: string;
    returnDate: string | null;
    dueDate: string;
}

export const borrowingApi = {
    borrowBook: async (bookId: number): Promise<BorrowingDetails> => {
        try {
            const response = await borrowingApiClient.post("/borrowings/borrow", {
                bookId
            });
            return response.data;
        } catch (error) {
            console.error("Error borrowing book:", error);
            throw error;
        }
    },

    getUserBorrowings: async (userId: number): Promise<BorrowingDetails[]> => {
        try {
            const response = await borrowingApiClient.get(`/borrowings/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching user borrowings:", error);
            throw error;
        }
    },

    getCurrentUserBorrowings: async (): Promise<BorrowingDetails[]> => {
        try {
            const response = await borrowingApiClient.get("/borrowings/me");
            return response.data;
        } catch (error) {
            console.error("Error fetching current user borrowings:", error);
            throw error;
        }
    },

    returnBook: async (borrowingId: number): Promise<BorrowingDetails> => {
        try {
            const response = await borrowingApiClient.post(`/borrowings/return/${borrowingId}`);
            return response.data;
        } catch (error) {
            console.error("Error returning book:", error);
            throw error;
        }
    }
};
