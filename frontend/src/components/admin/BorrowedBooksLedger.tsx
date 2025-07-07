import { useState, useEffect } from 'react';
import { getAllBorrowedBooks } from '../../api/adminApi';
import type { BorrowedBook } from '../../api/adminApi';
import './BorrowedBooksLedger.css';

export default function BorrowedBooksLedger() {
    const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<BorrowedBook[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<'all' | 'borrowed' | 'returned'>('all');

    useEffect(() => {
        fetchBorrowedBooks();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchQuery, borrowedBooks, filterStatus]);

    const fetchBorrowedBooks = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching borrowed books...');
            const booksData = await getAllBorrowedBooks();
            console.log('Borrowed books fetched successfully:', booksData.length);
            setBorrowedBooks(booksData);
        } catch (err: any) {
            console.error('Error fetching borrowed books:', err);
            if (err.response?.status === 401) {
                setError('Session expired. Please login again.');
            } else if (err.response?.status === 403) {
                setError('Access denied. You do not have permission to view borrowed books.');
            } else {
                setError('Failed to fetch borrowed books. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = borrowedBooks;

        // Apply status filter
        if (filterStatus === 'borrowed') {
            filtered = filtered.filter(book => book.status === 'Not Returned');
        } else if (filterStatus === 'returned') {
            filtered = filtered.filter(book => book.status === 'Returned');
        }

        // Apply search filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(book =>
                book.borrowerName.toLowerCase().includes(query) ||
                book.borrowerUserCode.toLowerCase().includes(query) ||
                book.bookTitle.toLowerCase().includes(query) ||
                book.bookAuthor.toLowerCase().includes(query) ||
                book.bookIsbn.toLowerCase().includes(query)
            );
        }

        setFilteredBooks(filtered);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isOverdue = (dueDateString: string, returnDateString: string | null) => {
        if (returnDateString) return false; // Already returned
        const dueDate = new Date(dueDateString);
        const today = new Date();
        return today > dueDate;
    };

    const getDaysOverdue = (dueDateString: string) => {
        const dueDate = new Date(dueDateString);
        const today = new Date();
        const diffTime = today.getTime() - dueDate.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getStats = () => {
        const totalBooks = borrowedBooks.length;
        const currentlyBorrowed = borrowedBooks.filter(book => book.status === 'Not Returned').length;
        const returned = borrowedBooks.filter(book => book.status === 'Returned').length;
        const overdue = borrowedBooks.filter(book => 
            book.status === 'Not Returned' && isOverdue(book.dueDate, book.returnDate)
        ).length;

        return { totalBooks, currentlyBorrowed, returned, overdue };
    };

    const stats = getStats();

    if (loading) {
        return (
            <div className="borrowed-books-ledger">
                <div className="loading">Loading borrowed books...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="borrowed-books-ledger">
                <div className="error">
                    {error}
                    <button onClick={fetchBorrowedBooks} className="retry-button">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="borrowed-books-ledger">
            <div className="ledger-header">
                <h2>Books Borrowed Ledger</h2>
                
                {/* Statistics Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Transactions</h3>
                        <p className="stat-number">{stats.totalBooks}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Currently Borrowed</h3>
                        <p className="stat-number borrowed">{stats.currentlyBorrowed}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Returned</h3>
                        <p className="stat-number returned">{stats.returned}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Overdue</h3>
                        <p className="stat-number overdue">{stats.overdue}</p>
                    </div>
                </div>

                {/* Search and Filter Controls */}
                <div className="controls-section">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search by borrower, book title, author, or ISBN..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    
                    <div className="filter-buttons">
                        <button 
                            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('all')}
                        >
                            All ({borrowedBooks.length})
                        </button>
                        <button 
                            className={`filter-btn ${filterStatus === 'borrowed' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('borrowed')}
                        >
                            Borrowed ({stats.currentlyBorrowed})
                        </button>
                        <button 
                            className={`filter-btn ${filterStatus === 'returned' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('returned')}
                        >
                            Returned ({stats.returned})
                        </button>
                    </div>
                </div>
                
                <div className="results-info">
                    Showing {filteredBooks.length} of {borrowedBooks.length} transactions
                </div>
            </div>

            {/* Books Table */}
            <div className="table-container">
                {filteredBooks.length === 0 ? (
                    <div className="no-books">No borrowed books found matching your criteria</div>
                ) : (
                    <table className="borrowed-books-table">
                        <thead>
                            <tr>
                                <th>Borrower</th>
                                <th>User ID</th>
                                <th>Book Title</th>
                                <th>Author</th>
                                <th>ISBN</th>
                                <th>Borrow Date</th>
                                <th>Due Date</th>
                                <th>Return Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.map(book => {
                                const overdueFlag = book.status === 'Not Returned' && isOverdue(book.dueDate, book.returnDate);
                                const daysOverdue = overdueFlag ? getDaysOverdue(book.dueDate) : 0;
                                
                                return (
                                    <tr key={book.id} className={`${overdueFlag ? 'overdue-row' : ''}`}>
                                        <td className="borrower-name">{book.borrowerName}</td>
                                        <td className="user-code">{book.borrowerUserCode}</td>
                                        <td className="book-title">{book.bookTitle}</td>
                                        <td className="book-author">{book.bookAuthor}</td>
                                        <td className="book-isbn">{book.bookIsbn}</td>
                                        <td>{formatDate(book.borrowDate)}</td>
                                        <td className={overdueFlag ? 'overdue-date' : ''}>
                                            {formatDate(book.dueDate)}
                                            {overdueFlag && (
                                                <span className="overdue-badge">
                                                    {daysOverdue} day{daysOverdue !== 1 ? 's' : ''} overdue
                                                </span>
                                            )}
                                        </td>
                                        <td>{formatDate(book.returnDate)}</td>
                                        <td>
                                            <span className={`status-badge ${book.status === 'Returned' ? 'returned' : overdueFlag ? 'overdue' : 'borrowed'}`}>
                                                {overdueFlag ? 'Overdue' : book.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
