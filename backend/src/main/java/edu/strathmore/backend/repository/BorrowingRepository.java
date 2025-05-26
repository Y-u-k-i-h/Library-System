package edu.strathmore.backend.repository;

import edu.strathmore.backend.model.BorrowingDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface BorrowingRepository extends JpaRepository<BorrowingDetails, Long> {
    List<BorrowingDetails> findByBorrowerIdAndReturnDateIsNull(long borrowerId);
    long countByBorrowerIdAndReturnDateIsNull(long borrowerId);
}
