package edu.strathmore.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.strathmore.backend.dto.BookWithReservationDTO;
import edu.strathmore.backend.model.Book;
import edu.strathmore.backend.service.BookService;

@RestController
@RequestMapping("/api")
//@CrossOrigin(origins = "localhost:5174")
public class BookController {
    @Autowired
    private BookService bookService;

    // Add a book
    @PostMapping("/books")
    public ResponseEntity<Book> addBook(@RequestBody Book book) {
        Book savedBook = bookService.save(book);
        return ResponseEntity.ok(savedBook);
    }
    // Returns a list of all available books
    @GetMapping("/books")
    public List<Book> getAllBooks() {
        return bookService.findAll();
    }
    // Searches for a specific book by title
    @GetMapping("/books/{title}")
    public ResponseEntity<?> getBook(@PathVariable String title) {
        Book book = bookService.findByTitle(title);
        if(book != null) {
            return ResponseEntity.ok(book);
        }
        else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found");
        }

    }
    // Searches for the books by a specific author
    @GetMapping("/books/author/{author}")
    public List<Book> getBooksByAuthor(@PathVariable String author) {
        return bookService.findByAuthor(author);
    }
    // Search for book by isbn
    @GetMapping("/books/isbn/{isbn}")
    public ResponseEntity<?> getBookByISBN(@PathVariable String isbn) {
        Book book = bookService.findByIsbn(isbn);
        if(book != null) {
            return ResponseEntity.ok(book);
        }
        else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found");
        }
    }
    // Update a book's details
    @PutMapping("/books/{isbn}")
    public ResponseEntity<?> updateBook(@PathVariable String isbn, @RequestBody Book book) {
        Book updatedBook = bookService.updateBook(isbn, book);
        if(updatedBook != null) {
            return ResponseEntity.ok(updatedBook);
        }
        else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found");
        }
    }
    // Delete a book
    @DeleteMapping("/books/{title}")
    public ResponseEntity<?> deleteBook(@PathVariable String title) {
        boolean deleted = bookService.deleteByTitle(title);
        if(deleted) {
            return ResponseEntity.ok("Book deleted successfully");
        }
        else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found");
        }
    }
    // Delete a book by ID
    @DeleteMapping("/books/id/{id}")
    public ResponseEntity<?> deleteBookById(@PathVariable Long id) {
        bookService.deleteById(id);
        return ResponseEntity.ok("Book deleted successfully");
    }

    // Get all books with reservation counts
    @GetMapping("/books/with-reservations")
    public List<BookWithReservationDTO> getAllBooksWithReservations() {
        return bookService.findAllWithReservations();
    }
}
