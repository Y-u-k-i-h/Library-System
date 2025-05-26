package edu.strathmore.backend.repository;
// Controls connection to db
import edu.strathmore.backend.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByIsbn(String isbn);
    Optional<Book> findByTitle(String title);
    void deleteByTitle(String title);
    Optional<List<Book>> findByAuthor(String author);

}
