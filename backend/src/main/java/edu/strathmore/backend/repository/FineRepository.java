package edu.strathmore.backend.repository;

import edu.strathmore.backend.model.Fine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FineRepository extends JpaRepository<Fine, Long> {
    Optional<Fine> findByBorrowing_Id(long borrowingId);
    List<Fine> findByUserId(long id);

}
