import { useState, useEffect } from "react";
import { reservationApi, type Reservation } from "../../../api/reservationApi";
import { useNotification } from "../../../contexts/NotificationContext";
import { useDataRefresh } from "../../../contexts/DataRefreshContext";
import "./MyBooks.css";

export default function MyReservations() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [reservationToCancel, setReservationToCancel] = useState<Reservation | null>(null);
    const { showNotification } = useNotification();
    const { reservationsRefreshTrigger, triggerReservationsRefresh } = useDataRefresh();

    const fetchReservations = async () => {
        try {
            setLoading(true);
            setError(null);
            const userReservations = await reservationApi.getUserReservations();
            setReservations(userReservations);
        } catch (err) {
            console.error("Error fetching reservations:", err);
            const errorMessage = "Failed to load your reservations. Please try again.";
            setError(errorMessage);
            showNotification(errorMessage, 'error', undefined, undefined, false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    useEffect(() => {
        fetchReservations();
    }, [reservationsRefreshTrigger]); // Re-fetch when reservations refresh is triggered specifically

    const handleCancelReservation = (reservation: Reservation) => {
        setReservationToCancel(reservation);
        setShowCancelModal(true);
    };

    const handleCancelReservationConfirm = async () => {
        if (!reservationToCancel) return;

        try {
            setCancellingId(reservationToCancel.id);
            
            // Close modal and reset state
            setShowCancelModal(false);
            setReservationToCancel(null);
            
            // Show processing notification
            showNotification(
                `Cancelling reservation for "${reservationToCancel.book.title}"...`,
                'info',
                'cancelled',
                reservationToCancel.book.title,
                true // Toast notification
            );

            // Make the API call and wait for response (more natural feeling)
            await reservationApi.cancelReservation(reservationToCancel.id);
            console.log('Reservation cancelled successfully');
            
            // Remove the cancelled reservation from the list after successful API call
            setReservations(prev => prev.filter(r => r.id !== reservationToCancel.id));
            
            // Show success notifications
            showNotification(
                `Reservation cancelled successfully!`,
                'success',
                'cancelled',
                reservationToCancel.book.title,
                true // Toast notification
            );
            showNotification(
                `You cancelled reservation for "${reservationToCancel.book.title}".`,
                'success',
                'cancelled',
                reservationToCancel.book.title,
                false // Dropdown notification
            );

            // Trigger background refresh to sync data
            triggerReservationsRefresh();

        } catch (error: any) {
            console.error("Error cancelling reservation:", error);
            
            // Handle specific error cases
            if (error.response?.status === 404) {
                // Reservation was already cancelled, remove it from the list
                setReservations(prev => prev.filter(r => r.id !== reservationToCancel.id));
                showNotification(
                    `Reservation for "${reservationToCancel.book.title}" was already cancelled.`,
                    'info',
                    'cancelled',
                    reservationToCancel.book.title,
                    false
                );
            } else {
                // Show error notification for failures
                showNotification(
                    `Failed to cancel reservation for "${reservationToCancel.book.title}". Please try again.`,
                    'error',
                    'cancelled',
                    reservationToCancel.book.title,
                    false
                );
            }
        } finally {
            setCancellingId(null);
        }
    };

    const handleCancelReservationCancel = () => {
        setShowCancelModal(false);
        setReservationToCancel(null);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isExpiredSoon = (expiryDate: string) => {
        const expiry = new Date(expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 2;
    };

    if (loading) {
        return (
            <div className="my-books-container">
                <div className="my-books-header">
                    <h1>My Reservations</h1>
                    <p>Loading your book reservations...</p>
                </div>
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-books-container">
                <div className="my-books-header">
                    <h1>My Reservations</h1>
                    <p className="error-message">{error}</p>
                </div>
                <button onClick={fetchReservations} className="retry-btn">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="my-books-container">
            <div className="my-books-header">
                <h1>My Reservations</h1>
                <p>
                    {reservations.length === 0
                        ? "You have no active reservations."
                        : `You have ${reservations.length} active reservation${reservations.length > 1 ? 's' : ''}.`
                    }
                </p>
            </div>

            {reservations.length === 0 ? (
                <div className="no-books-message">
                    <h3>No Reservations Found</h3>
                    <p>You haven't reserved any books yet.</p>
                    <p>When you reserve a book that's currently borrowed, it will appear here.</p>
                </div>
            ) : (
                <div className="books-grid">
                    {reservations.map((reservation) => (
                        <div key={reservation.id} className="book-card reservation-card">
                            <div className="book-card-header">
                                <div className="book-id">#{reservation.book.bookId}</div>
                                <div className="reservation-status">
                                    <span className="status-badge reserved">Reserved</span>
                                    {isExpiredSoon(reservation.expiryDate) && (
                                        <span className="status-badge expiring">Expiring Soon</span>
                                    )}
                                </div>
                            </div>

                            <div className="book-card-content">
                                <h3 className="book-title">{reservation.book.title}</h3>
                                <p className="book-author">by {reservation.book.author}</p>
                                <p className="book-publisher">Published by {reservation.book.publisher}</p>
                                <div className="book-details">
                                    <span className="book-genre">{reservation.book.genre}</span>
                                    <span className="book-condition">{reservation.book.book_condition}</span>
                                </div>
                                <p className="book-isbn">ISBN: {reservation.book.isbn}</p>
                                
                                <div className="reservation-dates">
                                    <div className="date-info">
                                        <strong>Reserved on:</strong> {formatDate(reservation.reservationDate)}
                                    </div>
                                    <div className="date-info">
                                        <strong>Expires on:</strong> {formatDate(reservation.expiryDate)}
                                    </div>
                                </div>
                            </div>

                            <div className="book-card-actions">
                                <button
                                    className="action-button cancel-btn"
                                    onClick={() => handleCancelReservation(reservation)}
                                    disabled={cancellingId === reservation.id}
                                >
                                    {cancellingId === reservation.id ? 'Cancelling...' : 'Cancel Reservation'}
                                </button>
                                <button className="action-button details-btn">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Cancel Reservation Confirmation Modal */}
            {showCancelModal && reservationToCancel && (
                <div className="confirmation-overlay">
                    <div className="confirmation-modal">
                        <div className="confirmation-header">
                            <h3>Cancel Reservation</h3>
                        </div>
                        <div className="confirmation-content">
                            <p>Are you sure you want to cancel your reservation for this book?</p>
                            <div className="book-info">
                                <strong>{reservationToCancel.book.title}</strong>
                                <span>by {reservationToCancel.book.author}</span>
                            </div>
                            <p style={{ marginTop: '12px', fontSize: '13px', color: '#ef4444' }}>
                                <strong>Note:</strong> This action cannot be undone. You'll need to make a new reservation if you change your mind.
                            </p>
                        </div>
                        <div className="confirmation-actions">
                            <button 
                                className="cancel-btn"
                                onClick={handleCancelReservationCancel}
                                disabled={cancellingId === reservationToCancel.id}
                            >
                                Keep Reservation
                            </button>
                            <button 
                                className="confirm-btn cancel-reservation-btn"
                                onClick={handleCancelReservationConfirm}
                                disabled={cancellingId === reservationToCancel.id}
                            >
                                {cancellingId === reservationToCancel.id ? 'Cancelling...' : 'Cancel Reservation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
