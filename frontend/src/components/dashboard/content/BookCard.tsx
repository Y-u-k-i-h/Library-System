import { useState } from "react";
import type { Book } from "../../../api/booksApi";
import { borrowingApi } from "../../../api/borrowingApi";
import "./book-card.css";

interface BookCardProps {
    book: Book;
}

export default function BookCard({ book }: BookCardProps) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleReserveClick = () => {
        setShowConfirmation(true);
    };

    const handleConfirmReservation = async () => {
        try {
            setIsLoading(true);
            
            // Check if user is authenticated (token exists)
            const token = localStorage.getItem('jwtToken');
            
            if (!token) {
                throw new Error("User not authenticated");
            }

            console.log('Debug - Token exists:', !!token);
            console.log('Debug - BookId:', book.bookId);
            
            // Make the API call to borrow the book (no need to send userId anymore)
            const borrowingResult = await borrowingApi.borrowBook(book.bookId);
            
            console.log('Book borrowed successfully:', borrowingResult);
            
            // You might want to show a success message or update the UI
            // For now, we'll just close the modal
            setShowConfirmation(false);
            
            // TODO: You might want to refresh the book list or show a success notification
            
        } catch (error: any) {
            console.error('Error borrowing book:', error);
            
            // Enhanced error logging
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
                console.error('Response headers:', error.response.headers);
            }
            
            // Handle different types of errors
            if (error.response?.status === 401) {
                alert('Authentication failed. Please try logging in again.');
            } else if (error.response?.status === 403) {
                alert('You do not have permission to borrow this book.');
            } else if (error.response?.data?.message) {
                alert(`Failed to borrow the book: ${error.response.data.message}`);
            } else {
                alert('Failed to borrow the book. Please try again.');
            }
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
                    <div className={`availability-status ${book.availability ? 'available' : 'unavailable'}`}>
                        {book.availability ? 'Available' : 'Checked Out'}
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
                        disabled={!book.availability}
                        onClick={handleReserveClick}
                    >
                        {book.availability ? 'Reserve' : 'Unavailable'}
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
                            <h3>Confirm Book Reservation</h3>
                        </div>
                        <div className="confirmation-content">
                            <p>Are you sure you want to reserve this book?</p>
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
                                {isLoading ? 'Reserving...' : 'Confirm Reservation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
