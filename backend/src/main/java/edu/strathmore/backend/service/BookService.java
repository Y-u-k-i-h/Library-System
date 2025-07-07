package edu.strathmore.backend.service;
// Main Logic layer
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.strathmore.backend.dto.BookWithReservationDTO;
import edu.strathmore.backend.model.Book;
import edu.strathmore.backend.repository.BookRepository;
import edu.strathmore.backend.repository.ReservationRepository;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private ReservationRepository reservationRepository;

    // Create
    public Book save(Book book) {
        return bookRepository.save(book);
    }

    // Read
    public List<Book> findAll() {
        return bookRepository.findAll();
    }
    
    // Get all books with reservation information - optimized to avoid N+1 queries
    public List<BookWithReservationDTO> findAllWithReservations() {
        List<Book> books = bookRepository.findAll();
        
        // Get all reservation counts in a single query
        List<Object[]> reservationCounts = reservationRepository.getActiveReservationCounts();
        Map<Long, Long> reservationCountMap = reservationCounts.stream()
            .collect(Collectors.toMap(
                row -> (Long) row[0], // book id
                row -> (Long) row[1]  // count
            ));
        
        return books.stream().map(book -> {
            long reservationCount = reservationCountMap.getOrDefault(book.getId(), 0L);
            return new BookWithReservationDTO(
                book.getId(),
                book.getBookId(),
                book.getTitle(),
                book.getAuthor(),
                book.getPublisher(),
                book.getIsbn(),
                book.getGenre(),
                book.isAvailability(),
                book.getBook_condition(),
                reservationCount
            );
        }).collect(Collectors.toList());
    }
    
    public Optional<Book> findById(Long id) {
        return bookRepository.findById(id);
    }
    
    public Optional<Book> findByBookId(long bookId) {
        return bookRepository.findByBookId(bookId);
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
