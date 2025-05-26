package edu.strathmore.backend.service;

import edu.strathmore.backend.model.Feedback;

import java.util.List;
import java.util.Optional;

public interface FeedbackService {
    Feedback createFeedback(Feedback feedback);
    List<Feedback> getAllFeedback();
    Optional<Feedback> getFeedbackById(Long id);
    List<Feedback> getFeedbackByBook(Long bookId);
    List<Feedback> getFeedbackByUser(Long userId);
    void deleteFeedback(Long id);
}