package edu.strathmore.backend.service;

import edu.strathmore.backend.model.BorrowingDetails;

import java.util.List;

public interface BorrowingService {
    BorrowingDetails borrowBook(long userId, long bookId);
    BorrowingDetails returnBook(long borrowingId);
    List<BorrowingDetails> getCurrentBorrowingsByUser(long userId);

}
