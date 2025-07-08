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
borrowingApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('Authentication failed - please login again');
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
    },

    getBorrowingHistory: async (): Promise<BorrowingDetails[]> => {
        try {
            // Use the dedicated history endpoint that queries borrowing_details table
            // for only returned books (where returnDate is not null)
            const response = await borrowingApiClient.get("/borrowings/me/history");
            return response.data || [];
        } catch (error) {
            console.error("Error fetching borrowing history:", error);
            // Fallback to the general endpoint with filtering if history endpoint fails
            try {
                console.log("Falling back to /borrowings/me with filtering...");
                const fallbackResponse = await borrowingApiClient.get("/borrowings/me");
                const allBorrowings = fallbackResponse.data || [];
                
                // Filter to only show borrowings that have been returned (history)
                const history = allBorrowings.filter((borrowing: BorrowingDetails) => 
                    borrowing.returnDate !== null
                );
                
                return history;
            } catch (fallbackError) {
                console.error("Fallback also failed:", fallbackError);
                throw error;
            }
        }
    }
};
