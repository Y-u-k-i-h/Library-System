import "./BookCardSkeleton.css";

export default function BookCardSkeleton() {
    return (
        <div className="book-card-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-author"></div>
                <div className="skeleton-genre"></div>
                <div className="skeleton-status"></div>
                <div className="skeleton-button"></div>
            </div>
        </div>
    );
}
