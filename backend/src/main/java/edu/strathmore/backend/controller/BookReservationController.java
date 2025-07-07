package edu.strathmore.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.strathmore.backend.model.Book;
import edu.strathmore.backend.service.BookService;
import edu.strathmore.backend.service.ReservationService;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:5173")
public class BookReservationController {
    
    @Autowired
    private BookService bookService;
    
    @Autowired
    private ReservationService reservationService;
    
    // Get reservation counts for multiple books by their IDs
    @PostMapping("/reservation-counts")
    public ResponseEntity<Map<Long, Long>> getReservationCounts(@RequestBody List<Long> bookIds) {
        Map<Long, Long> reservationCounts = new HashMap<>();
        
        for (Long bookId : bookIds) {
            try {
                Book book = bookService.findByBookId(bookId).orElse(null);
                if (book != null) {
                    long count = reservationService.getBookActiveReservations(book).size();
                    reservationCounts.put(bookId, count);
                } else {
                    reservationCounts.put(bookId, 0L);
                }
            } catch (Exception e) {
                reservationCounts.put(bookId, 0L);
            }
        }
        
        return ResponseEntity.ok(reservationCounts);
    }
}
