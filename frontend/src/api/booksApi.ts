import axios from "axios";

const BASE_URL = "http://localhost:8080/api/";

const booksApiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

// Interceptor to add JWT token to all requests
booksApiClient.interceptors.request.use(
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
booksApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Check if we actually have a token - if not, this might be expected
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                console.log('No token found for books API');
                return Promise.reject(error);
            }
            
            const errorMessage = error.response?.data?.message || '';
            console.log('401 error in books API:', errorMessage);
            
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

export interface Book {
    id?: number;
    bookId: number;
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    genre: string;
    availability: boolean;
    book_condition: string;
    reservationCount?: number;
    hasReservations?: boolean;
}

export const booksApi = {
    getAllBooks: async (): Promise<Book[]> => {
        try {
            const response = await booksApiClient.get("/books");
            return response.data;
        } catch (error) {
            console.error("Error fetching books:", error);
            throw error;
        }
    },

    // Get all books with reservation counts
    getBooksWithReservations: async (): Promise<Book[]> => {
        try {
            const response = await booksApiClient.get("/books/with-reservations");
            return response.data;
        } catch (error) {
            console.error("Error fetching books with reservations:", error);
            throw error;
        }
    },

    getBookByTitle: async(title: string): Promise<Book> => {
        try {
            const response = await booksApiClient.get(`/books/${title}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching book by title:', error);
            throw new Error(`Book with title "${title}" not found`);
        }
    },

    getBooksByAuthor: async (author: string): Promise<Book[]> => {
        try {
            const response = await booksApiClient.get(`/books/author/${author}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching books by author:', error);
            throw new Error(`No books found for author "${author}"`);
        }
    },

    addBook: async (book: Omit<Book, 'id'>): Promise<Book> => {
        try {
            const response = await booksApiClient.post("/books", book);
            return response.data;
        } catch (error) {
            console.error("Error adding book:", error);
            throw new Error("Failed to add book to library");
        }
    },

    getBookByISBN: async (isbn: string): Promise<Book> => {
        try {
            const response = await booksApiClient.get(`/books/isbn/${isbn}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching book by ISBN:', error);
            throw new Error(`Book with ISBN "${isbn}" not found`);
        }
    },

    updateBook: async (isbn: string, book: Partial<Book>): Promise<Book> => {
        try {
            const response = await booksApiClient.put(`/books/${isbn}`, book);
            return response.data;
        } catch (error) {
            console.error("Error updating book:", error);
            throw new Error(`Failed to update book with ISBN "${isbn}"`);
        }
    }
}