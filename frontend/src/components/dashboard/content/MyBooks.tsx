import { useState, useEffect } from 'react';
import { borrowingApi, type BorrowingDetails } from '../../../api/borrowingApi';
import { useNotification } from '../../../contexts/NotificationContext';
import { useDataRefresh } from '../../../contexts/DataRefreshContext';
import './MyBooks.css';
import './book-card.css'; // Import modal styles

export default function MyBooks() {
    const [borrowedBooks, setBorrowedBooks] = useState<BorrowingDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [returningBooks, setReturningBooks] = useState<Set<number>>(new Set());
    const [showReturnConfirmation, setShowReturnConfirmation] = useState(false);
    const [bookToReturn, setBookToReturn] = useState<{ id: number; title: string; author: string } | null>(null);
    const { showNotification } = useNotification();
    const { borrowingsRefreshTrigger, triggerBooksRefresh, triggerBorrowingsRefresh } = useDataRefresh();

    console.log(borrowedBooks);

    useEffect(() => {
        fetchBorrowedBooks();
    }, [borrowingsRefreshTrigger]); // Re-fetch when borrowings refresh is triggered specifically

    const fetchBorrowedBooks = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching borrowed books for current user...');
            console.log('JWT Token exists:', !!localStorage.getItem('jwtToken'));
            
            const borrowings = await borrowingApi.getCurrentUserBorrowings();
            console.log('Received borrowings:', borrowings);
            console.log('Number of borrowings:', borrowings.length);
            console.log('Type of borrowings:', typeof borrowings);
            console.log('Is array:', Array.isArray(borrowings));
            
            setBorrowedBooks(borrowings);
        } catch (err: any) {
            console.error("Error fetching borrowed books:", err);
            
            // Log detailed error information
            if (err.response) {
                console.error('Response status:', err.response.status);
                console.error('Response data:', err.response.data);
                console.error('Response headers:', err.response.headers);
            }
            
            setError(err instanceof Error ? err.message : "Failed to fetch borrowed books");
        } finally {
            setLoading(false);
        }
    };

    const handleReturnBook = async (borrowingId: number, bookTitle: string, bookAuthor: string) => {
        setBookToReturn({ id: borrowingId, title: bookTitle, author: bookAuthor });
        setShowReturnConfirmation(true);
    };

    const handleConfirmReturn = async () => {
        if (!bookToReturn) return;

        try {
            setReturningBooks(prev => new Set(prev).add(bookToReturn.id));
            setShowReturnConfirmation(false);
            
            console.log('Returning book with borrowing ID:', bookToReturn.id);
            
            // Show processing notification
            showNotification(
                `Processing return for "${bookToReturn.title}"...`,
                'info',
                'returned',
                bookToReturn.title,
                false, // No toast
                true // Show popup
            );

            // Make the API call and wait for response (more natural feeling)
            const returnResult = await borrowingApi.returnBook(bookToReturn.id);
            console.log('Book returned successfully:', returnResult);
            
            // Remove the book from the list after successful API call
            setBorrowedBooks(prev => prev.filter(borrowing => borrowing.id !== bookToReturn.id));
            
            // Show success notifications
            showNotification(
                `Book returned successfully!`,
                'success',
                'returned',
                bookToReturn.title,
                false, // No toast notification
                true // Show popup only
            );
            showNotification(
                `You returned "${bookToReturn.title}" - Thank you for returning on time!`,
                'success',
                'returned',
                bookToReturn.title,
                false // Dropdown notification only
            );

            // Trigger background refresh to sync other components
            triggerBooksRefresh();
            triggerBorrowingsRefresh();
            
            setBookToReturn(null);
            
        } catch (error: any) {
            console.error('Error returning book:', error);
            
            // Handle specific error cases
            if (error.response?.status === 404) {
                // Book was already returned, remove it from the list
                setBorrowedBooks(prev => prev.filter(borrowing => borrowing.id !== bookToReturn.id));
                showNotification(
                    `"${bookToReturn.title}" was already returned.`,
                    'info',
                    'returned',
                    bookToReturn.title,
                    false
                );
            } else {
                // Show error notification for other failures
                showNotification(
                    `Failed to return "${bookToReturn.title}". Please try again.`,
                    'error',
                    'returned',
                    bookToReturn.title,
                    false
                );
            }
            
        } finally {
            // Remove from returning state after a delay to show feedback
            setTimeout(() => {
                setReturningBooks(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(bookToReturn.id);
                    return newSet;
                });
            }, 1000);
        }
    };

    const handleCancelReturn = () => {
        setShowReturnConfirmation(false);
        setBookToReturn(null);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDaysLeft = (dueDateString: string) => {
        const dueDate = new Date(dueDateString);
        const today = new Date();
        const timeDiff = dueDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff;
    };

    const getStatusColor = (daysLeft: number) => {
        if (daysLeft < 0) return 'overdue';
        if (daysLeft <= 2) return 'due-soon';
        return 'safe';
    };

    const getStatusText = (daysLeft: number) => {
        if (daysLeft < 0) return `${Math.abs(daysLeft)} days overdue`;
        if (daysLeft === 0) return 'Due today';
        if (daysLeft === 1) return 'Due tomorrow';
        return `${daysLeft} days left`;
    };

    if (loading) {
        return (
            <div className="my-books-container">
                <div className="my-books-header">
                    <h1>My Books</h1>
                    <p>Manage your borrowed books</p>
                </div>
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading your books...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-books-container">
                <div className="my-books-header">
                    <h1>My Books</h1>
                    <p>Manage your borrowed books</p>
                </div>
                <div className="error-state">
                    <p>{error}</p>
                    <button onClick={fetchBorrowedBooks} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="my-books-container">
            <div className="my-books-header">
                <h1>My Books</h1>
                <p>Manage your borrowed books</p>
            </div>

            {borrowedBooks.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📚</div>
                    <h3>No books borrowed yet</h3>
                    <p>Start browsing our collection and borrow your first book!</p>
                </div>
            ) : (
                <div className="books-list">
                    <div className="books-summary">
                        <h2>Currently Borrowed ({borrowedBooks.length})</h2>
                        <p>You can borrow up to 5 books at a time</p>
                    </div>

                    <div className="borrowed-books-grid">
                        {borrowedBooks.map((borrowing) => {
                            const daysLeft = getDaysLeft(borrowing.dueDate);
                            const statusColor = getStatusColor(daysLeft);
                            const statusText = getStatusText(daysLeft);

                            return (
                                <div key={borrowing.id} className="borrowed-book-card">
                                    <div className="book-card-header">
                                        <div className="book-id">#{borrowing.book.bookId}</div>
                                        <div className={`due-status ${statusColor}`}>
                                            {statusText}
                                        </div>
                                    </div>

                                    <div className="book-card-content">
                                        <h3 className="book-title">{borrowing.book.title}</h3>
                                        <p className="book-author">by {borrowing.book.author}</p>
                                        <p className="book-publisher">Published by {borrowing.book.publisher}</p>
                                        <div className="book-details">
                                            <span className="book-genre">{borrowing.book.genre}</span>
                                            <span className="book-condition">{borrowing.book.book_condition}</span>
                                        </div>
                                        <p className="book-isbn">ISBN: {borrowing.book.isbn}</p>
                                    </div>

                                    <div className="borrowing-details">
                                        <div className="borrowing-info">
                                            <div className="info-item">
                                                <span className="info-label">Borrowed:</span>
                                                <span className="info-value">{formatDate(borrowing.borrowDate)}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Due:</span>
                                                <span className="info-value">{formatDate(borrowing.dueDate)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="book-actions">
                                            <button className="action-button renew-btn">
                                                Renew
                                            </button>
                                            <button 
                                                className="action-button return-btn"
                                                onClick={() => handleReturnBook(borrowing.id, borrowing.book.title, borrowing.book.author)}
                                                disabled={returningBooks.has(borrowing.id)}
                                            >
                                                {returningBooks.has(borrowing.id) ? 'Returning...' : 'Return'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Return Confirmation Modal */}
            {showReturnConfirmation && bookToReturn && (
                <div className="confirmation-overlay">
                    <div className="confirmation-modal">
                        <div className="confirmation-header">
                            <h3>Confirm Book Return</h3>
                        </div>
                        <div className="confirmation-content">
                            <p>Are you sure you want to return this book?</p>
                            <div className="book-info">
                                <strong>{bookToReturn.title}</strong>
                                <span>by {bookToReturn.author}</span>
                            </div>
                            <p className="return-note">
                                Once returned, the book will be available for other users to borrow.
                            </p>
                        </div>
                        <div className="confirmation-actions">
                            <button 
                                className="cancel-btn"
                                onClick={handleCancelReturn}
                                disabled={returningBooks.has(bookToReturn.id)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="confirm-btn return-confirm-btn"
                                onClick={handleConfirmReturn}
                                disabled={returningBooks.has(bookToReturn.id)}
                            >
                                {returningBooks.has(bookToReturn.id) ? 'Returning...' : 'Confirm Return'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
