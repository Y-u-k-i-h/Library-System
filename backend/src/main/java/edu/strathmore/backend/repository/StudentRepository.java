package edu.strathmore.backend.repository;

import edu.strathmore.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByStudentId(long studentId);
    void deleteByStudentId(long studentId);
}
