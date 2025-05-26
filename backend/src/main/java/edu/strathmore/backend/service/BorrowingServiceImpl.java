package edu.strathmore.backend.service;

import edu.strathmore.backend.model.Book;
import edu.strathmore.backend.model.BorrowingDetails;
import edu.strathmore.backend.model.User;
import edu.strathmore.backend.repository.BookRepository;
import edu.strathmore.backend.repository.BorrowingRepository;
import edu.strathmore.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BorrowingServiceImpl implements BorrowingService {
    @Autowired
    private BorrowingRepository borrowingRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public BorrowingDetails borrowBook(long userId, long id){
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(id).orElseThrow(() -> new RuntimeException("Book not found"));

        if(!book.isAvailability()){
            throw new RuntimeException("Book is not available");
        }
        long currentBooks = borrowingRepository.countByBorrowerIdAndReturnDateIsNull(userId);
        if(currentBooks >= 5){
            throw new RuntimeException("Maximum Limit on Books borrowed");
        }
        book.setAvailability(false);
        bookRepository.save(book);

        BorrowingDetails bd = new BorrowingDetails();
        bd.setBorrower(user);
        bd.setBook(book);
        bd.setBorrowDate(LocalDate.now());
        bd.setDueDate(LocalDate.now().plusDays(14));
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

}
