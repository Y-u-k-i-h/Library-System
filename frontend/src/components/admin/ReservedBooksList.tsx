import { useState, useEffect } from 'react';
import { getAllReservedBooks } from '../../api/adminApi';
import type { ReservedBook } from '../../api/adminApi';
import './ReservedBooksList.css';

export default function ReservedBooksList() {
    const [reservedBooks, setReservedBooks] = useState<ReservedBook[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<ReservedBook[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'cancelled'>('all');

    useEffect(() => {
        fetchReservedBooks();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchQuery, reservedBooks, filterStatus]);

    const fetchReservedBooks = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching reserved books...');
            const booksData = await getAllReservedBooks();
            console.log('Reserved books fetched successfully:', booksData.length);
            setReservedBooks(booksData);
        } catch (err: any) {
            console.error('Error fetching reserved books:', err);
            if (err.response?.status === 401) {
                setError('Session expired. Please login again.');
            } else if (err.response?.status === 403) {
                setError('Access denied. You do not have permission to view reserved books.');
            } else {
                setError('Failed to fetch reserved books. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = reservedBooks;

        // Apply status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(book => {
                const status = book.status.toLowerCase();
                return status === filterStatus;
            });
        }

        // Apply search filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(book =>
                book.userFullName.toLowerCase().includes(query) ||
                book.userCode.toLowerCase().includes(query) ||
                book.bookTitle.toLowerCase().includes(query) ||
                book.bookAuthor.toLowerCase().includes(query) ||
                book.bookIsbn.toLowerCase().includes(query)
            );
        }

        setFilteredBooks(filtered);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'No Expiry';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isExpiringSoon = (expiryDateString: string | null, status: string) => {
        if (!expiryDateString || status !== 'Active') return false;
        const expiryDate = new Date(expiryDateString);
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 3 && diffDays > 0; // Expiring within 3 days
    };

    const getDaysUntilExpiry = (expiryDateString: string | null) => {
        if (!expiryDateString) return null;
        const expiryDate = new Date(expiryDateString);
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getStats = () => {
        const totalReservations = reservedBooks.length;
        const activeReservations = reservedBooks.filter(book => book.status === 'Active').length;
        const expiredReservations = reservedBooks.filter(book => book.status === 'Expired').length;
        const cancelledReservations = reservedBooks.filter(book => book.status === 'Cancelled').length;
        const expiringSoon = reservedBooks.filter(book => 
            isExpiringSoon(book.expiryDate, book.status)
        ).length;

        return { 
            totalReservations, 
            activeReservations, 
            expiredReservations, 
            cancelledReservations,
            expiringSoon 
        };
    };

    const stats = getStats();

    if (loading) {
        return (
            <div className="reserved-books-list">
                <div className="loading">Loading reserved books...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="reserved-books-list">
                <div className="error">
                    {error}
                    <button onClick={fetchReservedBooks} className="retry-button">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="reserved-books-list">
            <div className="list-header">
                <h2>Reserved Books List</h2>
                
                {/* Statistics Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Reservations</h3>
                        <p className="stat-number">{stats.totalReservations}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Active</h3>
                        <p className="stat-number active">{stats.activeReservations}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Expired</h3>
                        <p className="stat-number expired">{stats.expiredReservations}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Expiring Soon</h3>
                        <p className="stat-number expiring">{stats.expiringSoon}</p>
                    </div>
                </div>

                {/* Search and Filter Controls */}
                <div className="controls-section">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search by user, book title, author, or ISBN..."
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
                            All ({reservedBooks.length})
                        </button>
                        <button 
                            className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('active')}
                        >
                            Active ({stats.activeReservations})
                        </button>
                        <button 
                            className={`filter-btn ${filterStatus === 'expired' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('expired')}
                        >
                            Expired ({stats.expiredReservations})
                        </button>
                        <button 
                            className={`filter-btn ${filterStatus === 'cancelled' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('cancelled')}
                        >
                            Cancelled ({stats.cancelledReservations})
                        </button>
                    </div>
                </div>
                
                <div className="results-info">
                    Showing {filteredBooks.length} of {reservedBooks.length} reservations
                </div>
            </div>

            {/* Reservations Table */}
            <div className="table-container">
                {filteredBooks.length === 0 ? (
                    <div className="no-books">No reserved books found matching your criteria</div>
                ) : (
                    <table className="reserved-books-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>User ID</th>
                                <th>Book Title</th>
                                <th>Author</th>
                                <th>ISBN</th>
                                <th>Reserved Date</th>
                                <th>Expiry Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.map(book => {
                                const expiringSoonFlag = isExpiringSoon(book.expiryDate, book.status);
                                const daysUntilExpiry = getDaysUntilExpiry(book.expiryDate);
                                
                                return (
                                    <tr key={book.id} className={`${expiringSoonFlag ? 'expiring-soon-row' : ''}`}>
                                        <td className="user-name">{book.userFullName}</td>
                                        <td className="user-code">{book.userCode}</td>
                                        <td className="book-title">{book.bookTitle}</td>
                                        <td className="book-author">{book.bookAuthor}</td>
                                        <td className="book-isbn">{book.bookIsbn}</td>
                                        <td>{formatDate(book.reservationDate)}</td>
                                        <td className={expiringSoonFlag ? 'expiring-date' : ''}>
                                            {formatDate(book.expiryDate)}
                                            {expiringSoonFlag && daysUntilExpiry && daysUntilExpiry > 0 && (
                                                <span className="expiring-badge">
                                                    Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${book.status.toLowerCase()}`}>
                                                {book.status}
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
