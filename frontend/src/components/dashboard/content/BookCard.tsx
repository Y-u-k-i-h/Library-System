import { useState, useEffect } from "react";
import type { Book } from "../../../api/booksApi";
import { borrowingApi } from "../../../api/borrowingApi";
import { reservationApi } from "../../../api/reservationApi";
import { useNotification } from "../../../contexts/NotificationContext";
import { useDataRefresh } from "../../../contexts/DataRefreshContext";
import "./book-card.css";

interface BookCardProps {
    book: Book;
    onBookUpdated?: (bookId: number, updates: Partial<Book>) => void;
}

export default function BookCard({ book, onBookUpdated }: BookCardProps) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [actionType, setActionType] = useState<'borrow' | 'reserve'>('borrow');
    const [localBook, setLocalBook] = useState(book); // Local state for optimistic updates
    const { showNotification } = useNotification();
    const { triggerBooksRefresh, triggerBorrowingsRefresh } = useDataRefresh();

    // Sync local book state when prop changes
    useEffect(() => {
        setLocalBook(book);
    }, [book]);

    const handleActionClick = async () => {
        if (localBook.availability) {
            setActionType('borrow');
            setShowConfirmation(true);
        } else {
            // Check if user has already reserved this book before showing confirmation
            try {
                const hasReserved = await reservationApi.hasUserReservedBook(localBook.bookId);
                if (hasReserved) {
                    showNotification(
                        `You have already reserved "${localBook.title}". You can only have one active reservation per book.`,
                        'warning',
                        'reserved',
                        localBook.title,
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
                    localBook.title,
                    false
                );
            }
        }
    };

    const handleConfirmReservation = async () => {
        if (!localBook?.bookId) {
            showNotification('Invalid book data. Please refresh the page.', 'error', actionType, localBook.title, false);
            return;
        }

        try {
            setIsLoading(true);
            
            // Check if user is authenticated (token exists)
            const token = localStorage.getItem('jwtToken');
            
            if (!token) {
                showNotification('Please log in to continue.', 'error', actionType, localBook.title, false);
                setIsLoading(false);
                return;
            }

            console.log('Debug - Starting book action:', actionType, 'for book:', localBook.bookId);
            
            if (actionType === 'borrow') {
                // Make the API call and wait for response (more natural feeling)
                const borrowingResult = await borrowingApi.borrowBook(localBook.bookId);
                console.log('Book borrowed successfully:', borrowingResult);
                
                // Update the book state after successful API call
                const updatedBook = { ...localBook, availability: false };
                setLocalBook(updatedBook);
                onBookUpdated?.(localBook.bookId, { availability: false });
                
                // Show success notifications
                showNotification(
                    `Successfully borrowed "${localBook.title}"!`,
                    'success',
                    'borrowed',
                    localBook.title,
                    true // Toast notification
                );
                showNotification(
                    `You borrowed "${localBook.title}" - Enjoy your reading!`,
                    'success',
                    'borrowed',
                    localBook.title,
                    false // Dropdown notification
                );
                
                // Trigger background refresh to sync other components
                triggerBooksRefresh();
                triggerBorrowingsRefresh();
                
            } else {
                // Make the API call and wait for response
                const reservationResult = await reservationApi.reserveBook(localBook.bookId);
                console.log('Book reserved successfully:', reservationResult);
                
                // Update reservation count after successful API call
                const updatedBook = { 
                    ...localBook, 
                    reservationCount: (localBook.reservationCount || 0) + 1,
                    hasReservations: true
                };
                setLocalBook(updatedBook);
                onBookUpdated?.(localBook.bookId, { 
                    reservationCount: (localBook.reservationCount || 0) + 1,
                    hasReservations: true
                });
                
                // Show success notifications
                showNotification(
                    `Successfully reserved "${localBook.title}"!`,
                    'success',
                    'reserved',
                    localBook.title,
                    true // Toast notification
                );
                showNotification(
                    `You reserved "${localBook.title}" - You'll be notified when available!`,
                    'success',
                    'reserved',
                    localBook.title,
                    false // Dropdown notification
                );

                // Trigger background refresh to sync exact counts
                triggerBooksRefresh();
            }
            
            // Close the modal after successful operation
            setShowConfirmation(false);
            
        } catch (error: any) {
            console.error('Error processing book action:', error);
            
            // Close the modal first
            setShowConfirmation(false);
            
            // Handle different types of errors with better detection
            let errorMessage = `Failed to ${actionType} "${localBook.title}". Please try again.`;
            
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
                    ? `"${localBook.title}" has already been borrowed.`
                    : `You have already reserved "${localBook.title}".`;
            } else if (error.code === 'NETWORK_ERROR' || !error.response) {
                errorMessage = 'Network error. Please check your connection and try again.';
            }
            
            showNotification(errorMessage, 'error', actionType, localBook.title, false);
            
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
                    <div className="book-id">#{localBook.bookId}</div>
                    <div className="status-container">
                        <div className={`availability-status ${localBook.availability ? 'available' : 'unavailable'}`}>
                            {localBook.availability ? 'Available' : 'Borrowed'}
                        </div>
                        {localBook.hasReservations && (
                            <div className="reservation-status-indicator">
                                <span className="reservation-count">{localBook.reservationCount} reserved</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="book-card-content">
                    <h3 className="book-title">{localBook.title}</h3>
                    <p className="book-author">by {localBook.author}</p>
                    <p className="book-publisher">Published by {localBook.publisher}</p>
                    <div className="book-details">
                        <span className="book-genre">{localBook.genre}</span>
                        <span className="book-condition">{localBook.book_condition}</span>
                    </div>
                    <p className="book-isbn">ISBN: {localBook.isbn}</p>
                </div>

                <div className="book-card-actions">
                    <button
                        className={`action-button ${localBook.availability ? 'reserve-btn' : 'unavailable-btn'}`}
                        onClick={handleActionClick}
                    >
                        {localBook.availability ? 'Borrow' : 'Reserve'}
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
                                <strong>{localBook.title}</strong>
                                <span>by {localBook.author}</span>
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
