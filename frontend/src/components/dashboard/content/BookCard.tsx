import { useState } from "react";
import type { Book } from "../../../api/booksApi";
import { borrowingApi } from "../../../api/borrowingApi";
import { reservationApi } from "../../../api/reservationApi";
import { useNotification } from "../../../contexts/NotificationContext";
import { useDataRefresh } from "../../../contexts/DataRefreshContext";
import "./book-card.css";

interface BookCardProps {
    book: Book;
    onBookUpdated?: () => void;
}

export default function BookCard({ book, onBookUpdated }: BookCardProps) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [actionType, setActionType] = useState<'borrow' | 'reserve'>('borrow');
    const { showNotification } = useNotification();
    const { triggerBooksRefresh, triggerBorrowingsRefresh } = useDataRefresh();

    const handleActionClick = async () => {
        if (book.availability) {
            setActionType('borrow');
            setShowConfirmation(true);
        } else {
            // Check if user has already reserved this book before showing confirmation
            try {
                const hasReserved = await reservationApi.hasUserReservedBook(book.bookId);
                if (hasReserved) {
                    showNotification(
                        `You have already reserved "${book.title}". You can only have one active reservation per book.`,
                        'warning',
                        'reserved',
                        book.title,
                        false
                    );
                    return;
                }
                setActionType('reserve');
                setShowConfirmation(true);
            } catch (error) {
                console.error('Error checking reservation status:', error);
                showNotification(
                    'Unable to check reservation status. Please try again.',
                    'error',
                    undefined,
                    book.title,
                    false
                );
            }
        }
    };

    const handleConfirmReservation = async () => {
        if (!book?.bookId) {
            showNotification('Invalid book data. Please refresh the page.', 'error', actionType, book.title, false);
            return;
        }

        try {
            setIsLoading(true);
            
            // Check if user is authenticated (token exists)
            const token = localStorage.getItem('jwtToken');
            
            if (!token) {
                showNotification('Please log in to continue.', 'error', actionType, book.title, false);
                return;
            }

            console.log('Debug - Starting book action:', actionType, 'for book:', book.bookId);
            
            if (actionType === 'borrow') {
                // Make the API call to borrow the book
                const borrowingResult = await borrowingApi.borrowBook(book.bookId);
                console.log('Book borrowed successfully:', borrowingResult);
                
                // Show success notifications
                showNotification(
                    `Successfully borrowed "${book.title}"!`,
                    'success',
                    'borrowed',
                    book.title,
                    true // Toast notification
                );
                showNotification(
                    `You borrowed "${book.title}" - Enjoy your reading!`,
                    'success',
                    'borrowed',
                    book.title,
                    false // Dropdown notification
                );

                // Trigger data refresh for books and borrowings
                triggerBooksRefresh();
                triggerBorrowingsRefresh();
                
            } else {
                // Make the API call to reserve the book
                const reservationResult = await reservationApi.reserveBook(book.bookId);
                console.log('Book reserved successfully:', reservationResult);
                
                // Show success notifications
                showNotification(
                    `Successfully reserved "${book.title}"!`,
                    'success',
                    'reserved',
                    book.title,
                    true // Toast notification
                );
                showNotification(
                    `You reserved "${book.title}" - You'll be notified when available!`,
                    'success',
                    'reserved',
                    book.title,
                    false // Dropdown notification
                );

                // Trigger data refresh for books and reservations
                triggerBooksRefresh();
            }
            
            // Close the modal and call update callback
            setShowConfirmation(false);
            onBookUpdated?.();
            
        } catch (error: any) {
            console.error('Error processing book action:', error);
            
            // Enhanced error logging
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            }
            
            // Close the modal first
            setShowConfirmation(false);
            
            // Handle different types of errors with better detection
            let errorMessage = `Failed to ${actionType} "${book.title}". Please try again.`;
            
            if (error.response?.status === 401) {
                errorMessage = 'Your session has expired. Please log in again.';
            } else if (error.response?.status === 403) {
                errorMessage = `You do not have permission to ${actionType} this book.`;
            } else if (error.response?.status === 400) {
                // Handle specific backend error messages
                const backendMessage = error.response?.data;
                if (typeof backendMessage === 'string') {
                    errorMessage = backendMessage;
                } else if (backendMessage?.message) {
                    errorMessage = backendMessage.message;
                }
            } else if (error.response?.status === 409) {
                // Conflict - book already borrowed/reserved
                errorMessage = actionType === 'borrow' 
                    ? `"${book.title}" has already been borrowed.`
                    : `You have already reserved "${book.title}".`;
            } else if (error.code === 'NETWORK_ERROR' || !error.response) {
                errorMessage = 'Network error. Please check your connection and try again.';
            }
            
            showNotification(errorMessage, 'error', actionType, book.title, false);
            
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelReservation = () => {
        setShowConfirmation(false);
    };

    return (
        <>
            <div className="book-card">
                <div className="book-card-header">
                    <div className="book-id">#{book.bookId}</div>
                    <div className="status-container">
                        <div className={`availability-status ${book.availability ? 'available' : 'unavailable'}`}>
                            {book.availability ? 'Available' : 'Borrowed'}
                        </div>
                        {book.hasReservations && (
                            <div className="reservation-status-indicator">
                                <span className="reservation-count">{book.reservationCount} reserved</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="book-card-content">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">by {book.author}</p>
                    <p className="book-publisher">Published by {book.publisher}</p>
                    <div className="book-details">
                        <span className="book-genre">{book.genre}</span>
                        <span className="book-condition">{book.book_condition}</span>
                    </div>
                    <p className="book-isbn">ISBN: {book.isbn}</p>
                </div>

                <div className="book-card-actions">
                    <button
                        className={`action-button ${book.availability ? 'reserve-btn' : 'unavailable-btn'}`}
                        onClick={handleActionClick}
                    >
                        {book.availability ? 'Borrow' : 'Reserve'}
                    </button>
                    <button className="action-button details-btn">
                        View Details
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="confirmation-overlay">
                    <div className="confirmation-modal">
                        <div className="confirmation-header">
                            <h3>Confirm Book {actionType === 'borrow' ? 'Borrowing' : 'Reservation'}</h3>
                        </div>
                        <div className="confirmation-content">
                            <p>
                                Are you sure you want to {actionType === 'borrow' ? 'borrow' : 'reserve'} this book?
                                {actionType === 'reserve' && (
                                    <span className="reservation-note">
                                        <br />
                                        <small>You will be added to the reservation queue for this book.</small>
                                    </span>
                                )}
                            </p>
                            <div className="book-info">
                                <strong>{book.title}</strong>
                                <span>by {book.author}</span>
                            </div>
                        </div>
                        <div className="confirmation-actions">
                            <button 
                                className="cancel-btn"
                                onClick={handleCancelReservation}
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button 
                                className="confirm-btn"
                                onClick={handleConfirmReservation}
                                disabled={isLoading}
                            >
                                {isLoading ? 
                                    (actionType === 'borrow' ? 'Borrowing...' : 'Reserving...') : 
                                    (actionType === 'borrow' ? 'Confirm Borrow' : 'Confirm Reservation')
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
