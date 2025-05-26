package edu.strathmore.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class BorrowingDetails {
    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    @JoinColumn(name="user_id")
    @JsonIgnore
    private User borrower;

    @ManyToOne
    @JoinColumn(name="book_id")
    private Book book;

    private LocalDate borrowDate;
    private LocalDate returnDate;
    private LocalDate dueDate;

    public BorrowingDetails() {}
    public BorrowingDetails(User borrower, Book book, LocalDate borrowDate, LocalDate returnDate, LocalDate dueDate) {
        this.borrower = borrower;
        this.book = book;
        this.borrowDate = borrowDate;
        this.returnDate = returnDate;
        this.dueDate = dueDate;
    }


    public long getId() {
        return id;
    }

    public void setId(long borrowing_id) {
        this.id = borrowing_id;
    }

    public User getBorrower() {
        return borrower;
    }

    public void setBorrower(User borrower) {
        this.borrower = borrower;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public LocalDate getBorrowDate() {
        return borrowDate;
    }

    public void setBorrowDate(LocalDate borrowDate) {
        this.borrowDate = borrowDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
}
