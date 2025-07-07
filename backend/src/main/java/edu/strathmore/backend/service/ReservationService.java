package edu.strathmore.backend.service;

import java.util.List;

import edu.strathmore.backend.model.Book;
import edu.strathmore.backend.model.Reservation;
import edu.strathmore.backend.model.User;

public interface ReservationService {
    
    // Create a new reservation
    Reservation createReservation(User user, Book book);
    
    // Cancel a reservation
    void cancelReservation(Long reservationId, User user);
    
    // Get all active reservations for a user
    List<Reservation> getUserActiveReservations(User user);
    
    // Get active reservations for a book
    List<Reservation> getBookActiveReservations(Book book);
    
    // Check if a book has active reservations
    boolean hasActiveReservations(Book book);
    
    // Check if a user has already reserved a book
    boolean hasUserReservedBook(User user, Book book);
    
    // Get the next user in queue for a book
    Reservation getNextReservationForBook(Book book);
    
    // Process reservation when book is returned (automatically borrow to next in queue)
    void processReservationQueue(Book book);
}
