import axios from "axios";

const BASE_URL = "http://localhost:8080/api/";

const reservationApiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

// Interceptor to add JWT token to all requests
reservationApiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        console.log('Debug - Reservation API Request - Token exists:', !!token);
        console.log('Debug - Reservation API Request - Request URL:', config.url);
        console.log('Debug - Reservation API Request - Request method:', config.method);
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Debug - Reservation API Request - Authorization header set');
        } else {
            console.warn('Debug - Reservation API Request - No token found in localStorage');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle 401 responses (token expired/invalid)
reservationApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Check if we actually have a token - if not, this might be expected
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                console.log('No token found for reservation API');
                return Promise.reject(error);
            }
            
            const errorMessage = error.response?.data?.message || '';
            console.log('401 error in reservation API:', errorMessage);
            
            // Only clear auth on definitive token issues
            if (errorMessage.includes('expired') || errorMessage.includes('invalid') || errorMessage.includes('malformed')) {
                console.warn('Authentication token expired. Please log in again.');
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userCode');
                localStorage.removeItem('userName');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 100);
            }
        }
        return Promise.reject(error);
    }
);

export interface Reservation {
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
    reservationDate: string;
    expiryDate: string;
    active: boolean;
}

export const reservationApi = {
    // Get current user's reservations
    getUserReservations: async (): Promise<Reservation[]> => {
        try {
            const response = await reservationApiClient.get("reservations/me");
            return response.data;
        } catch (error) {
            console.error("Error fetching user reservations:", error);
            throw error;
        }
    },

    // Create a new reservation
    reserveBook: async (bookId: number): Promise<Reservation> => {
        try {
            const response = await reservationApiClient.post(`reservations/reserve/${bookId}`);
            return response.data;
        } catch (error) {
            console.error("Error reserving book:", error);
            throw error;
        }
    },

    // Cancel a reservation
    cancelReservation: async (reservationId: number): Promise<string> => {
        try {
            const response = await reservationApiClient.delete(`reservations/${reservationId}`);
            return response.data;
        } catch (error) {
            console.error("Error cancelling reservation:", error);
            throw error;
        }
    },

    // Get reservations for a specific book
    getBookReservations: async (bookId: number): Promise<Reservation[]> => {
        try {
            const response = await reservationApiClient.get(`reservations/book/${bookId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching book reservations:", error);
            throw error;
        }
    },

    // Check if user has already reserved a specific book
    hasUserReservedBook: async (bookId: number): Promise<boolean> => {
        try {
            const userReservations = await reservationApiClient.get("reservations/me");
            const reservations: Reservation[] = userReservations.data;
            
            return reservations.some(reservation => 
                reservation.book.bookId === bookId && reservation.active
            );
        } catch (error) {
            console.error("Error checking user reservation status:", error);
            return false;
        }
    }
};
