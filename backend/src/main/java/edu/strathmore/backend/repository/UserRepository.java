package edu.strathmore.backend.repository;

import edu.strathmore.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUser_ID(String user_id);
}