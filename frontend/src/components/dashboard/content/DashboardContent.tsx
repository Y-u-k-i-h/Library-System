import { useState, useEffect } from "react";
import { booksApi, type Book } from "../../../api/booksApi";
import { authUtils } from "../../../api/authApi";

export default function DashboardContent() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState(authUtils.getCurrentUser());

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                console.log("Fetching books...");
                const fetchedBooks = await booksApi.getAllBooks();
                setBooks(fetchedBooks);
                console.log("Books fetched successfully:", fetchedBooks);
                setError(null);
            } catch (err) {
                console.error("Error fetching books:", err);
                setError("Failed to fetch books. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    return (
        <div className="dashboard-content">
            {loading && 
                <div>
                    looading...
                </div>}

            {error &&
                <div>
                    {error}
                </div>}

            {!loading && !error && (
                <div>
                    <p>Found {books.length} books!</p>
                </div>
            )}   
        </div>
    );
}