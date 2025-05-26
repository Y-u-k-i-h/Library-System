package edu.strathmore.backend.controller;

import edu.strathmore.backend.model.BorrowingDetails;
import edu.strathmore.backend.model.BorrowingRequest;
import edu.strathmore.backend.service.BorrowingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrowings")
public class BorrowingDetailsController {

    @Autowired
    private BorrowingService borrowingService;

    @PostMapping("/borrow")
    public ResponseEntity<?> borrowBook(@RequestBody BorrowingRequest borrowingRequest) {
        return ResponseEntity.ok(borrowingService.borrowBook(borrowingRequest.getUserId(), borrowingRequest.getBookId()));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> borrowedBooks(@PathVariable long userId) {
        List<BorrowingDetails> bd = borrowingService.getCurrentBorrowingsByUser(userId);
        return ResponseEntity.ok(bd);
    }

}
