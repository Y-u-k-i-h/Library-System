import type { Book } from "../../../api/booksApi";
import "./book-card.css";

interface BookCardProps {
    book: Book;
}

export default function BookCard({ book }: BookCardProps) {
    return (
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
                >
                    {book.availability ? 'Reserve' : 'Unavailable'}
                </button>
                <button className="action-button details-btn">
                    View Details
                </button>
            </div>
        </div>
    );
}
