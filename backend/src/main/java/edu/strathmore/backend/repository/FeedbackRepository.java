package edu.strathmore.backend.repository;

import edu.strathmore.backend.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByBookId(long bookId);
    List<Feedback> findByUserId(long userId);
}