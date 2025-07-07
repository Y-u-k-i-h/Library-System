package edu.strathmore.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.strathmore.backend.model.Book;
import edu.strathmore.backend.model.Reservation;
import edu.strathmore.backend.model.User;
import edu.strathmore.backend.repository.ReservationRepository;

@Service
public class ReservationServiceImpl implements ReservationService {
    
    @Autowired
    private ReservationRepository reservationRepository;
    
    @Override
    public Reservation createReservation(User user, Book book) {
        // Check if user already has a reservation for this book
        if (hasUserReservedBook(user, book)) {
            throw new RuntimeException("You have already reserved this book");
        }
        
        // Check if book is available (shouldn't allow reservation if book is available)
        if (book.isAvailability()) {
            throw new RuntimeException("Book is currently available. You can borrow it directly.");
        }
        
        // Create reservation with 7-day expiry
        LocalDateTime reservationDate = LocalDateTime.now();
        LocalDate expiryDate = LocalDate.now().plusDays(7);
        
        Reservation reservation = new Reservation(user, book, reservationDate, expiryDate);
        return reservationRepository.save(reservation);
    }
    
    @Override
    public void cancelReservation(Long reservationId, User user) {
        Optional<Reservation> reservationOpt = reservationRepository.findById(reservationId);
        if (reservationOpt.isPresent()) {
            Reservation reservation = reservationOpt.get();
            
            // Check if the reservation belongs to the user
            if (reservation.getUser().getId() != user.getId()) {
                throw new RuntimeException("You can only cancel your own reservations");
            }
            
            // Deactivate the reservation
            reservation.setActive(false);
            reservationRepository.save(reservation);
        } else {
            throw new RuntimeException("Reservation not found");
        }
    }
    
    @Override
    public List<Reservation> getUserActiveReservations(User user) {
        return reservationRepository.findByUserAndIsActiveTrue(user);
    }
    
    @Override
    public List<Reservation> getBookActiveReservations(Book book) {
        return reservationRepository.findByBookAndIsActiveTrue(book);
    }
    
    @Override
    public boolean hasActiveReservations(Book book) {
        return reservationRepository.countByBookAndIsActiveTrue(book) > 0;
    }
    
    @Override
    public boolean hasUserReservedBook(User user, Book book) {
        return reservationRepository.findByUserAndBookAndIsActiveTrue(user, book).isPresent();
    }
    
    @Override
    public Reservation getNextReservationForBook(Book book) {
        Optional<Reservation> reservation = reservationRepository.findFirstActiveReservationForBook(book);
        return reservation.orElse(null);
    }
    
    @Override
    public void processReservationQueue(Book book) {
        // This method can be called when a book is returned
        // to automatically handle the next reservation in queue
        Reservation nextReservation = getNextReservationForBook(book);
        if (nextReservation != null) {
            // Here you could automatically borrow the book to the next person in queue
            // or send them a notification that the book is now available
            // For now, we'll just keep the reservation active
            System.out.println("Next person in queue for book " + book.getTitle() + " is user " + nextReservation.getUser().getEmail());
        }
    }
}
