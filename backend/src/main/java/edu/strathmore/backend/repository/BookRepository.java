package edu.strathmore.backend.repository;
// Controls connection to db
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.strathmore.backend.model.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByIsbn(String isbn);
    Optional<Book> findByTitle(String title);
    Optional<Book> findByBookId(long bookId);
    void deleteByTitle(String title);
    Optional<List<Book>> findByAuthor(String author);

}
