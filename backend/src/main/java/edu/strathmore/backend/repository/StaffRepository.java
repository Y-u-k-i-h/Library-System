package edu.strathmore.backend.repository;
// Controls connection to db
import edu.strathmore.backend.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    Optional<Staff> findByStaffId(int staffId);
    void deleteByStaffId(int staffId);
}
