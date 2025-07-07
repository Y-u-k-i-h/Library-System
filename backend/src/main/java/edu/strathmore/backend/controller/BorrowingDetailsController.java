package edu.strathmore.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.strathmore.backend.model.BorrowingDetails;
import edu.strathmore.backend.model.BorrowingRequest;
import edu.strathmore.backend.service.BorrowingService;

@RestController
@RequestMapping("/api/borrowings")
public class BorrowingDetailsController {

    @Autowired
    private BorrowingService borrowingService;

    @PostMapping("/borrow")
    public ResponseEntity<?> borrowBook(@RequestBody BorrowingRequest borrowingRequest) {
        return ResponseEntity.ok(borrowingService.borrowBook(borrowingRequest.getBookId()));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> borrowedBooks(@PathVariable long userId) {
        List<BorrowingDetails> bd = borrowingService.getCurrentBorrowingsByUser(userId);
        return ResponseEntity.ok(bd);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUserBorrowings() {
        // Get the current user's borrowings using the authenticated user from security context
        List<BorrowingDetails> borrowings = borrowingService.getCurrentUserBorrowings();
        return ResponseEntity.ok(borrowings);
    }

    @PostMapping("/return/{borrowingId}")
    public ResponseEntity<?> returnBook(@PathVariable long borrowingId) {
        try {
            BorrowingDetails returnedBook = borrowingService.returnUserBook(borrowingId);
            return ResponseEntity.ok(returnedBook);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
