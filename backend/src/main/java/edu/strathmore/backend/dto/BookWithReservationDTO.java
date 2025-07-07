package edu.strathmore.backend.dto;

public class BookWithReservationDTO {
    private Long id;
    private long bookId;
    private String title;
    private String author;
    private String publisher;
    private String isbn;
    private String genre;
    private boolean availability;
    private String book_condition;
    private long reservationCount;
    private boolean hasReservations;

    public BookWithReservationDTO() {}

    public BookWithReservationDTO(Long id, long bookId, String title, String author, String publisher, 
                                  String isbn, String genre, boolean availability, String book_condition, 
                                  long reservationCount) {
        this.id = id;
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.isbn = isbn;
        this.genre = genre;
        this.availability = availability;
        this.book_condition = book_condition;
        this.reservationCount = reservationCount;
        this.hasReservations = reservationCount > 0;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public long getBookId() {
        return bookId;
    }

    public void setBookId(long bookId) {
        this.bookId = bookId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public boolean isAvailability() {
        return availability;
    }

    public void setAvailability(boolean availability) {
        this.availability = availability;
    }

    public String getBook_condition() {
        return book_condition;
    }

    public void setBook_condition(String book_condition) {
        this.book_condition = book_condition;
    }

    public long getReservationCount() {
        return reservationCount;
    }

    public void setReservationCount(long reservationCount) {
        this.reservationCount = reservationCount;
        this.hasReservations = reservationCount > 0;
    }

    public boolean isHasReservations() {
        return hasReservations;
    }

    public void setHasReservations(boolean hasReservations) {
        this.hasReservations = hasReservations;
    }
}
