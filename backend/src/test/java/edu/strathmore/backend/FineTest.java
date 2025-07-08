package edu.strathmore.backend;

import edu.strathmore.backend.model.Book; 
import edu.strathmore.backend.model.BorrowingDetails; 
import edu.strathmore.backend.model.Fine; 
import edu.strathmore.backend.model.User; 
import edu.strathmore.backend.repository.FineRepository;
import edu.strathmore.backend.service.FineServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


class PaymentDetails {
    protected Long id;
    protected float amount;
    protected LocalDate paymentDate;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public float getAmount() { return amount; }
    public void setAmount(float amount) { this.amount = amount; }
    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }
}


class BookTest extends Book { // Use a test-specific name to avoid conflict with actual import
    public BookTest(Long id, long bookId, String title, boolean availability) {
        super();
        setId(id);
        setBookId(bookId);
        setTitle(title);
        setAvailability(availability);
    }
}


class UserTest extends User { // Use a test-specific name
    public UserTest(Long id, String userCode, String fname) {
        super();
        setId(id);
        setUserCode(userCode);
        setFname(fname);

    }
}


class BorrowingDetailsTest extends BorrowingDetails {
    public BorrowingDetailsTest(Long id, User borrower, Book book, LocalDate borrowDate, LocalDate dueDate, LocalDate returnDate) {
        super();
        setId(id);
        setBorrower(borrower);
        setBook(book);
        setBorrowDate(borrowDate);
        setDueDate(dueDate);
        setReturnDate(returnDate);
    }
}


class FineTest extends Fine { // Use a test-specific name
    public FineTest(Long id, BorrowingDetails borrowing, String reason, LocalDate paymentDate, boolean paid, float amount) {
        super();

        this.setId(id);
        this.setPaymentDate(paymentDate);
        


        setBorrowing(borrowing);
        setReason(reason);
        setPaid(paid);
    }
}



@ExtendWith(MockitoExtension.class)
class FineServiceImplTest {

    @Mock
    private FineRepository fineRepo;

    @InjectMocks
    private FineServiceImpl fineService;

    private BorrowingDetailsTest overdueBorrowing;
    private BorrowingDetailsTest onTimeBorrowing;
    private FineTest unpaidFine;
    private FineTest paidFine;
    private UserTest testUser;
    private BookTest testBook;

    @BeforeEach
    void setUp() {
        testUser = new UserTest(1L, "user123", "Test User");
        testBook = new BookTest(101L, 1234L, "Test Book", true);

        // Overdue borrowing
        overdueBorrowing = new BorrowingDetailsTest(
                1L, testUser, testBook,
                LocalDate.of(2025, 1, 1), // Borrow Date
                LocalDate.of(2025, 1, 8), // Due Date
                LocalDate.of(2025, 1, 10) // Return Date (2 days overdue)
        );

        // On-time borrowing
        onTimeBorrowing = new BorrowingDetailsTest(
                2L, testUser, testBook,
                LocalDate.of(2025, 2, 1),
                LocalDate.of(2025, 2, 8),
                LocalDate.of(2025, 2, 8) // Return Date (on time)
        );


        unpaidFine = new FineTest(
                10L, overdueBorrowing, "Overdue by: 2 days",
                LocalDate.of(2025, 1, 10), false, 20.0f
        );

        // Paid fine
        paidFine = new FineTest(
                11L, onTimeBorrowing, "Overdue by: 1 day",
                LocalDate.of(2025, 2, 9), true, 10.0f
        );
    }

    // --- calculateFine(BorrowingDetails borrowing) tests ---
    @Test
    void calculateFine_bookOverdue_returnsFine() {
        when(fineRepo.save(any(Fine.class))).thenAnswer(invocation -> {
            Fine fine = invocation.getArgument(0);
            fine.setId(1L);
            return fine;
        });

        Fine result = fineService.calculateFine(overdueBorrowing);

        assertNotNull(result);
        
        assertEquals("Overdue by: 2 days", result.getReason());
        assertFalse(result.isPaid());
        assertEquals(overdueBorrowing.getId(), result.getBorrowing().getId());
        assertNotNull(result.getPaymentDate()); // Should be LocalDate.now()
        verify(fineRepo, times(1)).save(any(Fine.class));
    }

    @Test
    void calculateFine_bookOnTime_returnsNull() {
        Fine result = fineService.calculateFine(onTimeBorrowing);

        assertNull(result);
        verify(fineRepo, never()).save(any(Fine.class));
    }

    @Test
    void calculateFine_bookNotReturnedYet_throwsIllegalStateException() {
        BorrowingDetailsTest notReturnedBorrowing = new BorrowingDetailsTest(
                3L, new UserTest(2L, "ucode", "U Name"), new BookTest(102L, 5678L, "B Title", false),
                LocalDate.now().minusDays(10), LocalDate.now().minusDays(3), null
        );

        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            fineService.calculateFine(notReturnedBorrowing);
        });

        assertEquals("Book not returned yet", exception.getMessage());
        verify(fineRepo, never()).save(any(Fine.class));
    }

    @Test
    void calculateFine_daysOverdueIsZero_returnsNull() {
        BorrowingDetailsTest zeroOverdueBorrowing = new BorrowingDetailsTest(
                4L, new UserTest(3L, "ucode2", "U2 Name"), new BookTest(103L, 9012L, "B2 Title", false),
                LocalDate.of(2025, 3, 1), LocalDate.of(2025, 3, 8), LocalDate.of(2025, 3, 8)
        ); // Returned on due date

        Fine result = fineService.calculateFine(zeroOverdueBorrowing);

        assertNull(result);
        verify(fineRepo, never()).save(any(Fine.class));
    }

    @Test
    void calculateFine_daysOverdueIsNegative_returnsNull() {
        BorrowingDetailsTest earlyReturnBorrowing = new BorrowingDetailsTest(
                5L, new UserTest(4L, "ucode3", "U3 Name"), new BookTest(104L, 3456L, "B3 Title", false),
                LocalDate.of(2025, 4, 1), LocalDate.of(2025, 4, 8), LocalDate.of(2025, 4, 5)
        ); // Returned early

        Fine result = fineService.calculateFine(earlyReturnBorrowing);

        assertNull(result);
        verify(fineRepo, never()).save(any(Fine.class));
    }


    // --- payFine(long fineId) tests ---
    @Test
    void payFine_fineExistsAndUnpaid_marksAsPaid() {
        when(fineRepo.findById(unpaidFine.getId())).thenReturn(Optional.of(unpaidFine));
        when(fineRepo.save(any(Fine.class))).thenAnswer(invocation -> invocation.getArgument(0)); // Return the saved fine

        Fine result = fineService.payFine(unpaidFine.getId());

        assertNotNull(result);
        assertTrue(result.isPaid());
        assertEquals(LocalDate.now(), result.getPaymentDate());
        verify(fineRepo, times(1)).findById(unpaidFine.getId());
        verify(fineRepo, times(1)).save(unpaidFine);
    }

    @Test
    void payFine_fineDoesNotExist_throwsRuntimeException() {
        when(fineRepo.findById(anyLong())).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            fineService.payFine(99L);
        });

        assertEquals("Fine not found", exception.getMessage());
        verify(fineRepo, times(1)).findById(99L);
        verify(fineRepo, never()).save(any(Fine.class));
    }

    @Test
    void payFine_fineAlreadyPaid_throwsRuntimeException() {
        when(fineRepo.findById(paidFine.getId())).thenReturn(Optional.of(paidFine));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            fineService.payFine(paidFine.getId());
        });

        assertEquals("Fine already paid", exception.getMessage());
        verify(fineRepo, times(1)).findById(paidFine.getId());
        verify(fineRepo, never()).save(any(Fine.class));
    }

    // --- getFineByUserId(long userId) tests ---
    @Test
    void getFineByUserId_finesExist_returnsListOfFines() {
        UserTest user = new UserTest(1L, "testUser", "Test User");
        FineTest fine1 = new FineTest(1L, null, "Reason 1", LocalDate.now(), false, 10.0f);
        FineTest fine2 = new FineTest(2L, null, "Reason 2", LocalDate.now(), true, 5.0f);

        when(fineRepo.findByUserId(user.getId())).thenReturn(Arrays.asList(fine1, fine2));

        List<Fine> result = fineService.getFineByUserId(user.getId());

        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.contains(fine1));
        assertTrue(result.contains(fine2));
        verify(fineRepo, times(1)).findByUserId(user.getId());
    }

    @Test
    void getFineByUserId_noFinesExist_returnsEmptyList() {
        when(fineRepo.findByUserId(anyLong())).thenReturn(Collections.emptyList());

        List<Fine> result = fineService.getFineByUserId(99L);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(fineRepo, times(1)).findByUserId(99L);
    }
}