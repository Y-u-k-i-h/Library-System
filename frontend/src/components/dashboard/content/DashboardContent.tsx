import { useState, useEffect } from "react";
import { booksApi, type Book } from "../../../api/booksApi";
import { useDataRefresh } from "../../../contexts/DataRefreshContext";
import BookCard from "./BookCard";
import BookCardSkeleton from "./BookCardSkeleton";
import "./dashboard-content.css";

interface DashboardContentProps {
    appliedFilters: string[];
    searchTerm?: string;
}

export default function DashboardContent({ appliedFilters, searchTerm = "" }: DashboardContentProps) {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { refreshTrigger } = useDataRefresh();

    const fetchBooks = async (showLoadingState = true) => {
        try {
            if (showLoadingState) {
                setLoading(true);
            } else {
                setIsRefreshing(true);
            }
            
            console.log("Fetching books...");
            const fetchedBooks = await booksApi.getBooksWithReservations();
            
            // Books already include reservation counts from the API
            const booksWithReservations = fetchedBooks.map(book => ({
                ...book,
                hasReservations: (book.reservationCount || 0) > 0
            }));
            
            setBooks(booksWithReservations);
            console.log("Books fetched successfully:", booksWithReservations);
            setError(null);
        } catch (err) {
            console.error("Error fetching books:", err);
            setError("Failed to fetch books. Please try again later.");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        // Initial fetch or refresh when trigger changes
        fetchBooks();
    }, [refreshTrigger]);

    // Refresh when user returns to the tab
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                console.log("Tab became visible, refreshing books...");
                const fetchBooks = async () => {
                    try {
                        const fetchedBooks = await booksApi.getBooksWithReservations();
                        
                        // Books already include reservation counts from the API
                        const booksWithReservations = fetchedBooks.map(book => ({
                            ...book,
                            hasReservations: (book.reservationCount || 0) > 0
                        }));
                        
                        setBooks(booksWithReservations);
                        setError(null);
                    } catch (err) {
                        console.error("Error fetching books on tab focus:", err);
                    }
                };
                fetchBooks();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    // Function to handle refresh
    const handleRefresh = async () => {
        setLoading(false); // Don't show full skeleton for manual refresh
        setIsRefreshing(true); // Show subtle refresh indicator instead
        setError(null);
        try {
            console.log("Manual refresh triggered...");
            const fetchedBooks = await booksApi.getBooksWithReservations();
            
            // Books already include reservation counts from the API
            const booksWithReservations = fetchedBooks.map(book => ({
                ...book,
                hasReservations: (book.reservationCount || 0) > 0
            }));
            
            setBooks(booksWithReservations);
            console.log("Books refreshed successfully:", booksWithReservations);
        } catch (err) {
            console.error("Error during manual refresh:", err);
            setError("Failed to refresh books. Please try again later.");
        } finally {
            setIsRefreshing(false);
        }
    };

    // Function to filter books by genre
    const getBooksByGenre = (genres: string[]) => {
        return books.filter(book =>
            genres.some(genre =>
                book.genre.toLowerCase().includes(genre.toLowerCase())
            )
        );
    };

    // Function to filter books based on applied filters
    const getFilteredBooks = (booksToFilter: Book[]) => {
        if (appliedFilters.length === 0) {
            return booksToFilter;
        }

        return booksToFilter.filter(book => {
            // Check if book matches any of the applied filters
            return appliedFilters.some(filter => {
                // Check against genre
                if (book.genre.toLowerCase().includes(filter.toLowerCase())) {
                    return true;
                }

                // Check against availability status
                if (filter === "Available" && book.availability) {
                    return true;
                }
                if (filter === "Checked Out" && !book.availability) {
                    return true;
                }

                // For subject filters, we need to check if the book title or genre contains subject keywords
                const subjectKeywords = {
                    "Maths": ["calculus", "algebra", "mathematics", "statistics", "math"],
                    "Physics": ["physics", "quantum", "mechanics"],
                    "Chemistry": ["chemistry", "organic", "chemical"],
                    "Biology": ["biology", "cell", "genetics", "molecular"],
                    "Computer Science": ["programming", "algorithms", "software", "computer", "database", "networks", "operating"],
                    "History": ["history", "historical", "civilizations"],
                    "Law": ["law", "legal", "constitutional", "criminal"],
                    "Literature": ["literature", "poems", "poetry", "fiction"],
                    "Economics": ["economics", "economic", "microeconomics", "macroeconomics"],
                    "Philosophy": ["philosophy", "republic", "ethics", "meditations"]
                };

                if (subjectKeywords[filter as keyof typeof subjectKeywords]) {
                    const keywords = subjectKeywords[filter as keyof typeof subjectKeywords];
                    return keywords.some(keyword =>
                        book.title.toLowerCase().includes(keyword) ||
                        book.genre.toLowerCase().includes(keyword)
                    );
                }

                return false;
            });
        });
    };

    // Function to filter books based on search term
    const getSearchedBooks = (booksToSearch: Book[]) => {
        if (!searchTerm.trim()) {
            return booksToSearch;
        }

        const searchTermLower = searchTerm.toLowerCase();
        return booksToSearch.filter(book => {
            return book.title.toLowerCase().includes(searchTermLower) ||
                   book.author.toLowerCase().includes(searchTermLower);
        });
    };

    // Decide what to show based on filters and search
    const shouldShowAllSections = appliedFilters.length === 0 && !searchTerm.trim();
    const filteredBooks = getFilteredBooks(books);
    const finalBooks = getSearchedBooks(filteredBooks);

    // Create skeleton loading component
    const renderSkeletonGrid = (count: number = 10) => {
        return (
            <div className="books-grid">
                {Array.from({ length: count }, (_, index) => (
                    <BookCardSkeleton key={`skeleton-${index}`} />
                ))}
            </div>
        );
    };

    return (
        <div className="dashboard-content-wrapper">
            {/* Show skeleton loading when loading */}
            {loading && !error && (
                <div className="books-sections">
                    {/* Popular Books Skeleton */}
                    <div className="books-section">
                        <div className="section-header">
                            <h2 className="section-title">Popular Books</h2>
                        </div>
                        {renderSkeletonGrid(10)}
                    </div>

                    {/* Recommended Books Skeleton */}
                    <div className="books-section">
                        <h2 className="section-title">Recommended for You</h2>
                        {renderSkeletonGrid(8)}
                    </div>

                    {/* Fiction Skeleton */}
                    <div className="books-section">
                        <h2 className="section-title">Fiction</h2>
                        {renderSkeletonGrid(6)}
                    </div>

                    {/* Non-Fiction Skeleton */}
                    <div className="books-section">
                        <h2 className="section-title">Non-Fiction</h2>
                        {renderSkeletonGrid(6)}
                    </div>
                </div>
            )}

            {/* Show error state */}
            {error && (
                <div className="error-message">
                    <div>
                        <div>
                            {error}
                        </div>
                        <button
                            className="retry-button"
                            onClick={handleRefresh}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            {/* Display books by categories if available */}
            {!loading && !error && (
                <>
                    {/* Refresh Indicator */}
                    {isRefreshing && (
                        <div className="refresh-indicator">
                            <div className="refresh-spinner"></div>
                            <span>Syncing library data...</span>
                        </div>
                    )}
                    
                    <div className="books-sections">
                    {shouldShowAllSections ? (
                        <>
                            {/* Popular Books Section - Always at the top */}
                            <div className="books-section">
                                <div className="section-header">
                                    <h2 className="section-title">Popular Books</h2>
                                    <button 
                                        className="refresh-button" 
                                        onClick={handleRefresh}
                                        disabled={loading || isRefreshing}
                                        title="Refresh book availability"
                                    >
                                        <span className={`refresh-icon ${loading || isRefreshing ? 'spinning' : ''}`}>↻</span>
                                        Refresh
                                    </button>
                                </div>
                                <div className="books-grid">
                                    {books.slice(0, 10).map((book) => (
                                        <BookCard key={`popular-${book.id || book.bookId}`} book={book} />
                                    ))}
                                </div>
                                {books.length === 0 && (
                                    <div className="no-books-message">
                                        No books available at the moment.
                                    </div>
                                )}
                            </div>

                            {/* Recommended Books Section - Second priority */}
                            <div className="books-section">
                                <h2 className="section-title">Recommended for You</h2>
                                <div className="books-grid">
                                    {books.slice(5, 15).map((book) => (
                                        <BookCard key={`recommended-${book.id || book.bookId}`} book={book} />
                                    ))}
                                </div>
                                {books.length === 0 && (
                                    <div className="no-books-message">
                                        No recommended books available at the moment.
                                    </div>
                                )}
                            </div>

                            {/* Fiction Section */}
                            <div className="books-section">
                                <h2 className="section-title">Fiction</h2>
                                <div className="books-grid">
                                    {getBooksByGenre(['Fiction']).map((book) => (
                                        <BookCard key={`fiction-${book.id || book.bookId}`} book={book} />
                                    ))}
                                </div>
                                {getBooksByGenre(['Fiction']).length === 0 && (
                                    <div className="no-books-message">
                                        No fiction books available at the moment.
                                    </div>
                                )}
                            </div>

                            {/* Non-Fiction Section */}
                            <div className="books-section">
                                <h2 className="section-title">Non-Fiction</h2>
                                <div className="books-grid">
                                    {getBooksByGenre(['Non-Fiction']).map((book) => (
                                        <BookCard key={`nonfiction-${book.id || book.bookId}`} book={book} />
                                    ))}
                                </div>
                                {getBooksByGenre(['Non-Fiction']).length === 0 && (
                                    <div className="no-books-message">
                                        No non-fiction books available at the moment.
                                    </div>
                                )}
                            </div>

                            {/* Textbook Section */}
                            <div className="books-section">
                                <h2 className="section-title">Textbooks</h2>
                                <div className="books-grid">
                                    {getBooksByGenre(['Textbook']).map((book) => (
                                        <BookCard key={`textbook-${book.id || book.bookId}`} book={book} />
                                    ))}
                                </div>
                                {getBooksByGenre(['Textbook']).length === 0 && (
                                    <div className="no-books-message">
                                        No textbooks available at the moment.
                                    </div>
                                )}
                            </div>

                            {/* Biography Section */}
                            <div className="books-section">
                                <h2 className="section-title">Biography</h2>
                                <div className="books-grid">
                                    {getBooksByGenre(['Biography']).map((book) => (
                                        <BookCard key={`biography-${book.id || book.bookId}`} book={book} />
                                    ))}
                                </div>
                                {getBooksByGenre(['Biography']).length === 0 && (
                                    <div className="no-books-message">
                                        No biography books available at the moment.
                                    </div>
                                )}
                            </div>

                            {/* Poetry Section */}
                            <div className="books-section">
                                <h2 className="section-title">Poetry</h2>
                                <div className="books-grid">
                                    {getBooksByGenre(['Poetry']).map((book) => (
                                        <BookCard key={`poetry-${book.id || book.bookId}`} book={book} />
                                    ))}
                                </div>
                                {getBooksByGenre(['Poetry']).length === 0 && (
                                    <div className="no-books-message">
                                        No poetry books available at the moment.
                                    </div>
                                )}
                            </div>

                            {/* Children's Literature Section */}
                            <div className="books-section">
                                <h2 className="section-title">Children's Literature</h2>
                                <div className="books-grid">
                                    {getBooksByGenre(['Children\'s Literature']).map((book) => (
                                        <BookCard key={`children-${book.id || book.bookId}`} book={book} />
                                    ))}
                                </div>
                                {getBooksByGenre(['Children\'s Literature']).length === 0 && (
                                    <div className="no-books-message">
                                        No children's literature books available at the moment.
                                    </div>
                                )}
                            </div>

                            {/* Research Papers Section */}
                            <div className="books-section">
                                <h2 className="section-title">Research Papers</h2>
                                <div className="books-grid">
                                    {getBooksByGenre(['Research Paper']).map((book) => (
                                        <BookCard key={`research-${book.id || book.bookId}`} book={book} />
                                    ))}
                                </div>
                                {getBooksByGenre(['Research Paper']).length === 0 && (
                                    <div className="no-books-message">
                                        No research papers available at the moment.
                                    </div>
                                )}
                            </div>

                            {/* Atlas/Maps Section */}
                            <div className="books-section">
                                <h2 className="section-title">Atlas & Maps</h2>
                                <div className="books-grid">
                                    {getBooksByGenre(['Atlas/Maps']).map((book) => (
                                        <BookCard key={`atlas-${book.id || book.bookId}`} book={book} />
                                    ))}
                                </div>
                                {getBooksByGenre(['Atlas/Maps']).length === 0 && (
                                    <div className="no-books-message">
                                        No atlas or maps available at the moment.
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        /* Filtered Results Section */
                        <div className="books-section">
                            <h2 className="section-title">
                                {searchTerm.trim() ? 
                                    appliedFilters.length > 0 ? 
                                        `Search Results for "${searchTerm}" with filters (${finalBooks.length} books found)` :
                                        `Search Results for "${searchTerm}" (${finalBooks.length} books found)` :
                                    `Filtered Results (${finalBooks.length} books found)`
                                }
                            </h2>
                            <div className="filtered-books-grid">
                                {finalBooks.map((book) => (
                                    <BookCard key={`filtered-${book.id || book.bookId}`} book={book} />
                                ))}
                            </div>
                            {finalBooks.length === 0 && (
                                <div className="no-books-message">
                                    {searchTerm.trim() ? 
                                        `No books found matching "${searchTerm}". Try searching for a different book title or author.` :
                                        "No books match the selected filters. Try adjusting your filters."
                                    }
                                </div>
                            )}
                        </div>
                    )}
                    </div>
                </>
            )}
        </div>
    );
}
