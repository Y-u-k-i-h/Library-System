package edu.strathmore.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.strathmore.backend.model.Book;
import edu.strathmore.backend.model.Reservation;
import edu.strathmore.backend.model.User;
import edu.strathmore.backend.service.BookService;
import edu.strathmore.backend.service.ReservationService;
import edu.strathmore.backend.service.UserService;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservationController {
    
    @Autowired
    private ReservationService reservationService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private BookService bookService;
    
    // Get current user's reservations
    @GetMapping("/me")
    public ResponseEntity<List<Reservation>> getCurrentUserReservations() {
        try {
            // Get the current authenticated user from the security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String authenticatedUserCode = authentication.getName();
            
            User user = userService.findByUserCode(authenticatedUserCode);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            List<Reservation> reservations = reservationService.getUserActiveReservations(user);
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Create a new reservation
    @PostMapping("/reserve/{bookId}")
    public ResponseEntity<Reservation> createReservation(@PathVariable Long bookId) {
        try {
            // Get the current authenticated user from the security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String authenticatedUserCode = authentication.getName();
            
            User user = userService.findByUserCode(authenticatedUserCode);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            Optional<Book> bookOpt = bookService.findByBookId(bookId);
            if (!bookOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Book book = bookOpt.get();
            Reservation reservation = reservationService.createReservation(user, book);
            
            return ResponseEntity.ok(reservation);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Cancel a reservation
    @DeleteMapping("/{reservationId}")
    public ResponseEntity<String> cancelReservation(@PathVariable Long reservationId) {
        try {
            // Get the current authenticated user from the security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String authenticatedUserCode = authentication.getName();
            
            User user = userService.findByUserCode(authenticatedUserCode);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            reservationService.cancelReservation(reservationId, user);
            return ResponseEntity.ok("Reservation cancelled successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Check if a book has reservations (for admin/display purposes)
    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<Reservation>> getBookReservations(@PathVariable Long bookId) {
        try {
            Optional<Book> bookOpt = bookService.findByBookId(bookId);
            if (!bookOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Book book = bookOpt.get();
            List<Reservation> reservations = reservationService.getBookActiveReservations(book);
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
