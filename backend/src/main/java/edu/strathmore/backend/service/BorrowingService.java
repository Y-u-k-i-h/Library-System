package edu.strathmore.backend.service;

import java.util.List;

import edu.strathmore.backend.model.BorrowingDetails;

public interface BorrowingService {
    BorrowingDetails borrowBook(long bookId);
    BorrowingDetails returnBook(long borrowingId);
    BorrowingDetails returnUserBook(long borrowingId); // New method for authenticated user return
    List<BorrowingDetails> getCurrentBorrowingsByUser(long userId);
    List<BorrowingDetails> getCurrentUserBorrowings();
    List<BorrowingDetails> getAllUserBorrowings();
    List<BorrowingDetails> getUserBorrowingHistory();
}
