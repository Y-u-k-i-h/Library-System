package edu.strathmore.backend.service;
// Main Logic layer
import edu.strathmore.backend.model.Book;
import edu.strathmore.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    // Create
    public Book save(Book book) {
        return bookRepository.save(book);
    }

    // Read
    public List<Book> findAll() {
        return bookRepository.findAll();
    }
    public Book findByTitle(String title) {
        return bookRepository.findByTitle(title).orElse(null);
    }
    public Book findByIsbn(String isbn) {
        return bookRepository.findByIsbn(isbn).orElse(null);
    }
    public List<Book> findByAuthor(String author) {
        return bookRepository.findByAuthor(author).orElse(null);
    }

    // Update book
    public Book updateBook(String isbn, Book bookToUpdate) {
        return bookRepository.findByIsbn(isbn).map(book -> {
            book.setTitle(bookToUpdate.getTitle());
            book.setAuthor(bookToUpdate.getAuthor());
            book.setPublisher(bookToUpdate.getPublisher());
            book.setIsbn(bookToUpdate.getIsbn());
            book.setGenre(bookToUpdate.getGenre());
            book.setBook_condition(bookToUpdate.getBook_condition());
            book.setAvailability(bookToUpdate.isAvailability());

            return bookRepository.save(book);

        }).orElse(null);
    }

    // Delete
    public void deleteById(Long id) {
        bookRepository.deleteById(id);
    }

    public boolean deleteByTitle(String title) {
        Optional<Book> book = bookRepository.findByTitle(title);
        if (book.isPresent()) {
            bookRepository.deleteByTitle(title);
            return true;
        }
        else{
            return false;
        }
    }




}
