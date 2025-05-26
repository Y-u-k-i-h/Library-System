package edu.strathmore.backend.model;


// Data Transfer Object
public class BorrowingRequest {
    private long userId;
    private long bookId;

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public long getBookId() {
        return bookId;
    }

    public void setBookId(long bookId) {
        this.bookId = bookId;
    }
}
