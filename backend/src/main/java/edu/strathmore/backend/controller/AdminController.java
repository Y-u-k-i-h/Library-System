package edu.strathmore.backend.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.strathmore.backend.model.Book;
import edu.strathmore.backend.model.BorrowingDetails;
import edu.strathmore.backend.model.Reservation;
import edu.strathmore.backend.model.User;
import edu.strathmore.backend.repository.BorrowingRepository;
import edu.strathmore.backend.repository.ReservationRepository;
import edu.strathmore.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BorrowingRepository borrowingRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryDTO>> getAllUsers() {
        System.out.println("DEBUG: AdminController - getAllUsers called");
        try {
            List<User> users = userRepository.findAll();
            System.out.println("DEBUG: Found " + users.size() + " users");
            
            List<UserSummaryDTO> userSummaries = users.stream().map(user -> {
                // Librarians don't borrow books or have strikes, so set these to 0
                int borrowedBooksCount = 0;
                int strikes = 0;
                
                if ("STUDENT".equals(user.getRole())) {
                    // Only count borrowed books and strikes for students
                    borrowedBooksCount = (int) borrowingRepository.countByBorrowerIdAndReturnDateIsNull(user.getId());
                    strikes = user.getFailedAttempts(); // Using failedAttempts as strikes
                }
                
                return new UserSummaryDTO(
                    user.getId(),
                    user.getFname(),
                    user.getLname(),
                    user.getUserCode(),
                    user.getRole(),
                    borrowedBooksCount,
                    strikes
                );
            }).collect(Collectors.toList());
            
            System.out.println("DEBUG: Returning " + userSummaries.size() + " user summaries");
            return ResponseEntity.ok(userSummaries);
        } catch (Exception e) {
            System.err.println("DEBUG: Error in getAllUsers: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/users/search")
    public ResponseEntity<List<UserSummaryDTO>> searchUsers(@RequestParam String query) {
        List<User> users = userRepository.findAll();
        
        // Filter users based on search query
        List<User> filteredUsers = users.stream()
            .filter(user -> 
                user.getFname().toLowerCase().contains(query.toLowerCase()) ||
                user.getLname().toLowerCase().contains(query.toLowerCase()) ||
                user.getUserCode().toLowerCase().contains(query.toLowerCase())
            )
            .collect(Collectors.toList());
        
        List<UserSummaryDTO> userSummaries = filteredUsers.stream().map(user -> {
            // Librarians don't borrow books or have strikes, so set these to 0
            int borrowedBooksCount = 0;
            int strikes = 0;
            
            if ("STUDENT".equals(user.getRole())) {
                // Only count borrowed books and strikes for students
                borrowedBooksCount = (int) borrowingRepository.countByBorrowerIdAndReturnDateIsNull(user.getId());
                strikes = user.getFailedAttempts();
            }
            
            return new UserSummaryDTO(
                user.getId(),
                user.getFname(),
                user.getLname(),
                user.getUserCode(),
                user.getRole(),
                borrowedBooksCount,
                strikes
            );
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(userSummaries);
    }

    @GetMapping("/borrowed-books")
    public ResponseEntity<List<BorrowedBookDTO>> getAllBorrowedBooks() {
        System.out.println("DEBUG: AdminController - getAllBorrowedBooks called");
        try {
            List<BorrowingDetails> borrowings = borrowingRepository.findAll();
            System.out.println("DEBUG: Found " + borrowings.size() + " borrowing records");
            
            List<BorrowedBookDTO> borrowedBooks = borrowings.stream().map(borrowing -> {
                User borrower = borrowing.getBorrower();
                Book book = borrowing.getBook();
                
                return new BorrowedBookDTO(
                    borrowing.getId(),
                    borrower.getFname() + " " + borrower.getLname(),
                    borrower.getUserCode(),
                    book.getTitle(),
                    book.getAuthor(),
                    book.getIsbn(),
                    borrowing.getBorrowDate(),
                    borrowing.getDueDate(),
                    borrowing.getReturnDate(),
                    borrowing.getReturnDate() == null ? "Not Returned" : "Returned"
                );
            }).collect(Collectors.toList());
            
            System.out.println("DEBUG: Returning " + borrowedBooks.size() + " borrowed book records");
            return ResponseEntity.ok(borrowedBooks);
        } catch (Exception e) {
            System.err.println("DEBUG: Error in getAllBorrowedBooks: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/borrowed-books/search")
    public ResponseEntity<List<BorrowedBookDTO>> searchBorrowedBooks(@RequestParam String query) {
        List<BorrowingDetails> borrowings = borrowingRepository.findAll();
        
        // Filter borrowings based on search query
        List<BorrowingDetails> filteredBorrowings = borrowings.stream()
            .filter(borrowing -> {
                User borrower = borrowing.getBorrower();
                Book book = borrowing.getBook();
                String searchTerm = query.toLowerCase();
                
                return borrower.getFname().toLowerCase().contains(searchTerm) ||
                       borrower.getLname().toLowerCase().contains(searchTerm) ||
                       borrower.getUserCode().toLowerCase().contains(searchTerm) ||
                       book.getTitle().toLowerCase().contains(searchTerm) ||
                       book.getAuthor().toLowerCase().contains(searchTerm) ||
                       book.getIsbn().toLowerCase().contains(searchTerm);
            })
            .collect(Collectors.toList());
        
        List<BorrowedBookDTO> borrowedBooks = filteredBorrowings.stream().map(borrowing -> {
            User borrower = borrowing.getBorrower();
            Book book = borrowing.getBook();
            
            return new BorrowedBookDTO(
                borrowing.getId(),
                borrower.getFname() + " " + borrower.getLname(),
                borrower.getUserCode(),
                book.getTitle(),
                book.getAuthor(),
                book.getIsbn(),
                borrowing.getBorrowDate(),
                borrowing.getDueDate(),
                borrowing.getReturnDate(),
                borrowing.getReturnDate() == null ? "Not Returned" : "Returned"
            );
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(borrowedBooks);
    }

    @GetMapping("/reserved-books")
    public ResponseEntity<List<ReservedBookDTO>> getAllReservedBooks() {
        System.out.println("DEBUG: AdminController - getAllReservedBooks called");
        try {
            List<Reservation> reservations = reservationRepository.findAll();
            System.out.println("DEBUG: Found " + reservations.size() + " reservation records");
            
            List<ReservedBookDTO> reservedBooks = reservations.stream().map(reservation -> {
                User user = reservation.getUser();
                Book book = reservation.getBook();
                
                // Calculate status based on active flag and expiry date
                String status;
                if (!reservation.isActive()) {
                    status = "Cancelled";
                } else if (reservation.getExpiryDate() != null && 
                          reservation.getExpiryDate().isBefore(java.time.LocalDate.now())) {
                    status = "Expired";
                } else {
                    status = "Active";
                }
                
                return new ReservedBookDTO(
                    reservation.getId(),
                    user.getFname() + " " + user.getLname(),
                    user.getUserCode(),
                    book.getTitle(),
                    book.getAuthor(),
                    book.getIsbn(),
                    reservation.getReservationDate().toLocalDate(),
                    reservation.getExpiryDate(),
                    status
                );
            }).collect(Collectors.toList());
            
            System.out.println("DEBUG: Returning " + reservedBooks.size() + " reserved book records");
            return ResponseEntity.ok(reservedBooks);
        } catch (Exception e) {
            System.err.println("DEBUG: Error in getAllReservedBooks: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/reserved-books/search")
    public ResponseEntity<List<ReservedBookDTO>> searchReservedBooks(@RequestParam String query) {
        List<Reservation> reservations = reservationRepository.findAll();
        
        // Filter reservations based on search query
        List<Reservation> filteredReservations = reservations.stream()
            .filter(reservation -> {
                User user = reservation.getUser();
                Book book = reservation.getBook();
                String searchTerm = query.toLowerCase();
                
                return user.getFname().toLowerCase().contains(searchTerm) ||
                       user.getLname().toLowerCase().contains(searchTerm) ||
                       user.getUserCode().toLowerCase().contains(searchTerm) ||
                       book.getTitle().toLowerCase().contains(searchTerm) ||
                       book.getAuthor().toLowerCase().contains(searchTerm) ||
                       book.getIsbn().toLowerCase().contains(searchTerm);
            })
            .collect(Collectors.toList());
        
        List<ReservedBookDTO> reservedBooks = filteredReservations.stream().map(reservation -> {
            User user = reservation.getUser();
            Book book = reservation.getBook();
            
            String status;
            if (!reservation.isActive()) {
                status = "Cancelled";
            } else if (reservation.getExpiryDate() != null && 
                      reservation.getExpiryDate().isBefore(java.time.LocalDate.now())) {
                status = "Expired";
            } else {
                status = "Active";
            }
            
            return new ReservedBookDTO(
                reservation.getId(),
                user.getFname() + " " + user.getLname(),
                user.getUserCode(),
                book.getTitle(),
                book.getAuthor(),
                book.getIsbn(),
                reservation.getReservationDate().toLocalDate(),
                reservation.getExpiryDate(),
                status
            );
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(reservedBooks);
    }

    // DTO class for user summary
    public static class UserSummaryDTO {
        private Long id;
        private String firstName;
        private String lastName;
        private String userCode;
        private String role;
        private int borrowedBooksCount;
        private int strikes;

        public UserSummaryDTO(Long id, String firstName, String lastName, String userCode, 
                             String role, int borrowedBooksCount, int strikes) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.userCode = userCode;
            this.role = role;
            this.borrowedBooksCount = borrowedBooksCount;
            this.strikes = strikes;
        }

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }

        public String getUserCode() { return userCode; }
        public void setUserCode(String userCode) { this.userCode = userCode; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public int getBorrowedBooksCount() { return borrowedBooksCount; }
        public void setBorrowedBooksCount(int borrowedBooksCount) { this.borrowedBooksCount = borrowedBooksCount; }

        public int getStrikes() { return strikes; }
        public void setStrikes(int strikes) { this.strikes = strikes; }
    }

    // DTO class for borrowed book details
    public static class BorrowedBookDTO {
        private Long id;
        private String borrowerName;
        private String borrowerUserCode;
        private String bookTitle;
        private String bookAuthor;
        private String bookIsbn;
        private LocalDate borrowDate;
        private LocalDate dueDate;
        private LocalDate returnDate;
        private String status;

        public BorrowedBookDTO(Long id, String borrowerName, String borrowerUserCode, String bookTitle, 
                              String bookAuthor, String bookIsbn, LocalDate borrowDate, LocalDate dueDate, 
                              LocalDate returnDate, String status) {
            this.id = id;
            this.borrowerName = borrowerName;
            this.borrowerUserCode = borrowerUserCode;
            this.bookTitle = bookTitle;
            this.bookAuthor = bookAuthor;
            this.bookIsbn = bookIsbn;
            this.borrowDate = borrowDate;
            this.dueDate = dueDate;
            this.returnDate = returnDate;
            this.status = status;
        }

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getBorrowerName() { return borrowerName; }
        public void setBorrowerName(String borrowerName) { this.borrowerName = borrowerName; }

        public String getBorrowerUserCode() { return borrowerUserCode; }
        public void setBorrowerUserCode(String borrowerUserCode) { this.borrowerUserCode = borrowerUserCode; }

        public String getBookTitle() { return bookTitle; }
        public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }

        public String getBookAuthor() { return bookAuthor; }
        public void setBookAuthor(String bookAuthor) { this.bookAuthor = bookAuthor; }

        public String getBookIsbn() { return bookIsbn; }
        public void setBookIsbn(String bookIsbn) { this.bookIsbn = bookIsbn; }

        public LocalDate getBorrowDate() { return borrowDate; }
        public void setBorrowDate(LocalDate borrowDate) { this.borrowDate = borrowDate; }

        public LocalDate getDueDate() { return dueDate; }
        public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

        public LocalDate getReturnDate() { return returnDate; }
        public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    // DTO class for reserved book details
    public static class ReservedBookDTO {
        private Long id;
        private String userFullName;
        private String userCode;
        private String bookTitle;
        private String bookAuthor;
        private String bookIsbn;
        private LocalDate reservationDate;
        private LocalDate expiryDate;
        private String status;

        public ReservedBookDTO(Long id, String userFullName, String userCode, String bookTitle, 
                              String bookAuthor, String bookIsbn, LocalDate reservationDate, 
                              LocalDate expiryDate, String status) {
            this.id = id;
            this.userFullName = userFullName;
            this.userCode = userCode;
            this.bookTitle = bookTitle;
            this.bookAuthor = bookAuthor;
            this.bookIsbn = bookIsbn;
            this.reservationDate = reservationDate;
            this.expiryDate = expiryDate;
            this.status = status;
        }

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getUserFullName() { return userFullName; }
        public void setUserFullName(String userFullName) { this.userFullName = userFullName; }

        public String getUserCode() { return userCode; }
        public void setUserCode(String userCode) { this.userCode = userCode; }

        public String getBookTitle() { return bookTitle; }
        public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }

        public String getBookAuthor() { return bookAuthor; }
        public void setBookAuthor(String bookAuthor) { this.bookAuthor = bookAuthor; }

        public String getBookIsbn() { return bookIsbn; }
        public void setBookIsbn(String bookIsbn) { this.bookIsbn = bookIsbn; }

        public LocalDate getReservationDate() { return reservationDate; }
        public void setReservationDate(LocalDate reservationDate) { this.reservationDate = reservationDate; }

        public LocalDate getExpiryDate() { return expiryDate; }
        public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
