package edu.strathmore.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import edu.strathmore.backend.model.Book;
import edu.strathmore.backend.model.BorrowingDetails;
import edu.strathmore.backend.model.User;
import edu.strathmore.backend.repository.BookRepository;
import edu.strathmore.backend.repository.BorrowingRepository;
import edu.strathmore.backend.repository.UserRepository;

@Service
public class BorrowingServiceImpl implements BorrowingService {
    @Autowired
    private BorrowingRepository borrowingRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ReservationService reservationService;

    @Override
    public BorrowingDetails borrowBook(long bookId){
        // Get the authenticated user from the security context
        String authenticatedUserCode = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUserCode(authenticatedUserCode)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found: " + authenticatedUserCode));
        
        Book book = bookRepository.findByBookId(bookId).orElseThrow(() -> new RuntimeException("Book not found with bookId: " + bookId));

        if(!book.isAvailability()){
            throw new RuntimeException("Book is not available");
        }
        long currentBooks = borrowingRepository.countByBorrowerIdAndReturnDateIsNull(user.getId());
        if(currentBooks >= 5){
            throw new RuntimeException("Maximum Limit on Books borrowed");
        }
        book.setAvailability(false);
        bookRepository.save(book);

        BorrowingDetails bd = new BorrowingDetails();
        bd.setBorrower(user);
        bd.setBook(book);
        bd.setBorrowDate(LocalDate.now());
        bd.setDueDate(LocalDate.now().plusDays(7));
        return borrowingRepository.save(bd);

    }
    @Override
    public BorrowingDetails returnBook(long BorrowingId){
        BorrowingDetails bd = borrowingRepository.findById(BorrowingId).orElseThrow(()
                -> new RuntimeException("Book not found"));

        if(bd.getReturnDate() != null){
            throw new RuntimeException("Book is already returned");
        }
        bd.setReturnDate(LocalDate.now());
        Book book = bd.getBook();
        book.setAvailability(true);
        bookRepository.save(book);
        return borrowingRepository.save(bd);


    }
    @Override
    public List<BorrowingDetails> getCurrentBorrowingsByUser(long userId){
        return borrowingRepository.findByBorrowerIdAndReturnDateIsNull(userId);
    }

    @Override
    public List<BorrowingDetails> getCurrentUserBorrowings(){
        // Get the authenticated user from the security context
        String authenticatedUserCode = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUserCode(authenticatedUserCode)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found: " + authenticatedUserCode));
        
        return borrowingRepository.findByBorrowerIdAndReturnDateIsNull(user.getId());
    }

    @Override
    public List<BorrowingDetails> getAllUserBorrowings(){
        // Get the authenticated user from the security context
        String authenticatedUserCode = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUserCode(authenticatedUserCode)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found: " + authenticatedUserCode));
        
        return borrowingRepository.findByBorrowerId(user.getId());
    }

    @Override
    public List<BorrowingDetails> getUserBorrowingHistory(){
        // Get the authenticated user from the security context
        String authenticatedUserCode = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUserCode(authenticatedUserCode)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found: " + authenticatedUserCode));
        
        return borrowingRepository.findByBorrowerIdAndReturnDateIsNotNull(user.getId());
    }

    @Override
    public BorrowingDetails returnUserBook(long borrowingId){
        // Get the authenticated user from the security context
        String authenticatedUserCode = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUserCode(authenticatedUserCode)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found: " + authenticatedUserCode));
        
        BorrowingDetails bd = borrowingRepository.findById(borrowingId).orElseThrow(()
                -> new RuntimeException("Borrowing record not found"));

        // Verify that the borrowing belongs to the authenticated user
        if (bd.getBorrower().getId() != user.getId()) {
            throw new RuntimeException("You can only return your own borrowed books");
        }

        if(bd.getReturnDate() != null){
            throw new RuntimeException("Book is already returned");
        }
        
        bd.setReturnDate(LocalDate.now());
        Book book = bd.getBook();
        book.setAvailability(true);
        bookRepository.save(book);
        
        // Process reservation queue - this will handle any pending reservations
        reservationService.processReservationQueue(book);
        
        return borrowingRepository.save(bd);
    }

}
