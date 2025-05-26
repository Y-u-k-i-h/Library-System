package edu.strathmore.backend.repository;

import edu.strathmore.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findById(long id);
    Optional<User> findByEmail(String email);
}
