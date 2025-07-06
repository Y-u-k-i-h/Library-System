package edu.strathmore.backend.model;
// Entity definition for book class
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity

public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private long bookId;
    private String title;
    private String author;
    private String publisher;
    private String isbn;
    private String genre;
    private boolean availability;
    private String book_condition;

    public Book() {}

    public Book(String isbn, String title, String author, String publisher, String genre, boolean availability, String condition) {
        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.genre = genre;
        this.availability = availability;
        this.book_condition = condition;
        // Generate a bookId from ISBN (last 4 digits) or use a counter
        this.bookId = generateBookIdFromIsbn(isbn);
    }

    private long generateBookIdFromIsbn(String isbn) {
        // Extract last 4 digits from ISBN and convert to long
        String cleaned = isbn.replaceAll("[^0-9]", "");
        if (cleaned.length() >= 4) {
            return Long.parseLong(cleaned.substring(cleaned.length() - 4));
        }
        return System.currentTimeMillis() % 10000; // Fallback
    }
    public void setId(Long id) {
        this.id = id;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public void setAuthor(String author) {
        this.author = author;
    }
    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }
    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }
    public void setGenre(String genre) {
        this.genre = genre;
    }
    public void setAvailability(boolean availability) {
        this.availability = availability;
    }
    public void setBook_condition(String book_condition) {
        this.book_condition = book_condition;
    }
    public Long getId() {
        return id;
    }
    public String getIsbn() {
        return isbn;
    }
    public String getTitle() {
        return title;
    }
    public String getAuthor() {
        return author;
    }
    public String getPublisher() {
        return publisher;
    }
    public String getGenre() {
        return genre;
    }
    public boolean isAvailability() {
        return availability;
    }

    public String getBook_condition() {
        return book_condition;
    }


    public long getBookId() {
        return bookId;
    }

    public void setBookId(long bookId) {
        this.bookId = bookId;
    }
}
