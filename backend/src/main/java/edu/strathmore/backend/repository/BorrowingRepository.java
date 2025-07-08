package edu.strathmore.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.strathmore.backend.model.BorrowingDetails;
@Repository
public interface BorrowingRepository extends JpaRepository<BorrowingDetails, Long> {
    List<BorrowingDetails> findByBorrowerIdAndReturnDateIsNull(long borrowerId);
    long countByBorrowerIdAndReturnDateIsNull(long borrowerId);
    List<BorrowingDetails> findByBorrowerId(long borrowerId);
    List<BorrowingDetails> findByBorrowerIdAndReturnDateIsNotNull(long borrowerId);
}
