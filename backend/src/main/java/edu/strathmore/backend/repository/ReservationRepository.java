package edu.strathmore.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import edu.strathmore.backend.model.Book;
import edu.strathmore.backend.model.Reservation;
import edu.strathmore.backend.model.User;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    // Find active reservations for a user
    List<Reservation> findByUserAndIsActiveTrue(User user);
    
    // Find active reservations for a book
    List<Reservation> findByBookAndIsActiveTrue(Book book);
    
    // Check if a user has already reserved a specific book
    Optional<Reservation> findByUserAndBookAndIsActiveTrue(User user, Book book);
    
    // Find the first (oldest) active reservation for a book
    @Query("SELECT r FROM Reservation r WHERE r.book = :book AND r.isActive = true ORDER BY r.reservationDate ASC")
    Optional<Reservation> findFirstActiveReservationForBook(@Param("book") Book book);
    
    // Count active reservations for a book
    long countByBookAndIsActiveTrue(Book book);
    
    // Get reservation counts for all books in a single query
    @Query("SELECT r.book.id, COUNT(r) FROM Reservation r WHERE r.isActive = true GROUP BY r.book.id")
    List<Object[]> getActiveReservationCounts();
    
    // Find all active reservations
    List<Reservation> findByIsActiveTrue();
}
