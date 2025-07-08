import { useState, useEffect } from 'react';
import { borrowingApi, type BorrowingDetails } from '../../../api/borrowingApi';
import './HistoryContent.css';

interface HistoryContentProps {
    searchTerm?: string;
}

export default function HistoryContent({ searchTerm = '' }: HistoryContentProps) {
    const [borrowHistory, setBorrowHistory] = useState<BorrowingDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchBorrowHistory();
    }, []);

    const fetchBorrowHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const history = await borrowingApi.getBorrowingHistory();
            console.log('Borrowing history received:', history);
            console.log('Number of history items:', history.length);
            
            setBorrowHistory(history);
        } catch (err: any) {
            console.error("Error fetching borrowing history:", err);
            const errorMessage = err.response?.data?.message || err.message || "Failed to fetch borrowing history";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Debug: Add a method to test the basic endpoint
    const testEndpoint = async () => {
        try {
            console.log('=== DEBUGGING BORROWING HISTORY ===');
            console.log('Testing /borrowings/me/history endpoint...');
            
            // Test the dedicated history endpoint
            try {
                const historyResponse = await borrowingApi.getBorrowingHistory();
                console.log('History endpoint response:', historyResponse);
                console.log('History count:', historyResponse.length);
            } catch (historyError) {
                console.error('History endpoint failed:', historyError);
            }
            
            // Also test the general endpoint for comparison
            console.log('Testing /borrowings/me endpoint...');
            const allResponse = await borrowingApi.getCurrentUserBorrowings();
            console.log('All borrowings response:', allResponse);
            console.log('Total borrowings:', allResponse.length);
            
            if (Array.isArray(allResponse)) {
                console.log('Borrowings with returnDate:', allResponse.filter((b: BorrowingDetails) => b.returnDate !== null).length);
                console.log('Borrowings without returnDate:', allResponse.filter((b: BorrowingDetails) => b.returnDate === null).length);
                
                // Show sample data structure
                if (allResponse.length > 0) {
                    console.log('Sample borrowing record:', allResponse[0]);
                }
            }
            console.log('=== END DEBUGGING ===');
        } catch (error) {
            console.error('Endpoint test failed:', error);
        }
    };

    // Call test on component mount for debugging
    useEffect(() => {
        testEndpoint();
    }, []);

    const filteredHistory = borrowHistory.filter(borrowing =>
        borrowing.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        borrowing.book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        borrowing.book.isbn.includes(searchTerm)
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getBookStatus = (borrowing: BorrowingDetails) => {
        if (!borrowing.returnDate) {
            return 'borrowed'; // Still borrowed
        }
        
        const returnDate = new Date(borrowing.returnDate);
        const dueDate = new Date(borrowing.dueDate);
        
        return returnDate > dueDate ? 'overdue_returned' : 'returned';
    };

    const getStatusBadge = (borrowing: BorrowingDetails) => {
        const status = getBookStatus(borrowing);
        
        switch (status) {
            case 'returned':
                return <span className="status-badge returned">Returned</span>;
            case 'overdue_returned':
                return <span className="status-badge overdue-returned">Returned Late</span>;
            case 'borrowed':
                return <span className="status-badge borrowed">Currently Borrowed</span>;
            default:
                return <span className="status-badge">{status}</span>;
        }
    };

    const getReturnedOnTimeCount = () => {
        return borrowHistory.filter(borrowing => {
            if (!borrowing.returnDate) return false;
            const returnDate = new Date(borrowing.returnDate);
            const dueDate = new Date(borrowing.dueDate);
            return returnDate <= dueDate;
        }).length;
    };

    const getReturnedLateCount = () => {
        return borrowHistory.filter(borrowing => {
            if (!borrowing.returnDate) return false;
            const returnDate = new Date(borrowing.returnDate);
            const dueDate = new Date(borrowing.dueDate);
            return returnDate > dueDate;
        }).length;
    };

    return (
        <div className="history-container">
            <div className="history-header">
                <h1>Borrowing History</h1>
                <p>View your complete borrowing history and return dates</p>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your borrowing history...</p>
                </div>
            ) : error ? (
                <div className="error-container">
                    <p className="error-message">Error: {error}</p>
                    <button 
                        className="retry-button" 
                        onClick={fetchBorrowHistory}
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <div className="history-content">
                    <div className="history-stats">
                        <div className="stat-card">
                            <div className="stat-number">{borrowHistory.length}</div>
                            <div className="stat-label">Total Books Borrowed</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">
                                {getReturnedOnTimeCount()}
                            </div>
                            <div className="stat-label">Returned On Time</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">
                                {getReturnedLateCount()}
                            </div>
                            <div className="stat-label">Returned Late</div>
                        </div>
                    </div>

                    <div className="history-list">
                        <div className="list-header">
                            <h2>Borrowing Records</h2>
                            {searchTerm && (
                                <p className="search-results">
                                    Showing {filteredHistory.length} of {borrowHistory.length} records
                                </p>
                            )}
                        </div>

                        {filteredHistory.length === 0 ? (
                            <div className="no-history">
                                {borrowHistory.length === 0 ? (
                                    <>
                                        <p>No borrowing history found</p>
                                        <p>You haven't returned any books yet.</p>
                                    </>
                                ) : searchTerm ? (
                                    <>
                                        <p>No borrowing history found</p>
                                        <p>Try adjusting your search terms</p>
                                    </>
                                ) : (
                                    <p>No returned books found</p>
                                )}
                            </div>
                        ) : (
                            <div className="history-items">
                                {filteredHistory.map((borrowing) => (
                                    <div key={borrowing.id} className="history-item">
                                        <div className="book-card">
                                            <div className="book-info">
                                                <h3 className="book-title">{borrowing.book.title}</h3>
                                                <p className="book-author">by {borrowing.book.author}</p>
                                                <p className="book-details-text">
                                                    <span className="genre">{borrowing.book.genre}</span> • 
                                                    <span className="isbn">ISBN: {borrowing.book.isbn}</span>
                                                </p>
                                            </div>
                                            <div className="borrowing-dates">
                                                <div className="date-row">
                                                    <div className="date-item">
                                                        <span className="date-label">Borrowed:</span>
                                                        <span className="date-value">{formatDate(borrowing.borrowDate)}</span>
                                                    </div>
                                                    <div className="date-item">
                                                        <span className="date-label">Due Date:</span>
                                                        <span className="date-value">{formatDate(borrowing.dueDate)}</span>
                                                    </div>
                                                </div>
                                                <div className="date-row">
                                                    <div className="date-item">
                                                        <span className="date-label">Returned:</span>
                                                        <span className="date-value">
                                                            {borrowing.returnDate ? formatDate(borrowing.returnDate) : 'Not returned'}
                                                        </span>
                                                    </div>
                                                    <div className="status-container">
                                                        {getStatusBadge(borrowing)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
