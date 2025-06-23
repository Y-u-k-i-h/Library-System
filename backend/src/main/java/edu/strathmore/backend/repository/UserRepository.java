package edu.strathmore.backend.repository;

import edu.strathmore.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

        Optional<User> findByEmail(String email);
        Optional<User> findByUserCode(String userCode);
        boolean existsByUserCode(String userCode);
    }

