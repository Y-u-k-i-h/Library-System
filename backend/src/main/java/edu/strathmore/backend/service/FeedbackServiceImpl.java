package edu.strathmore.backend.service;

import edu.strathmore.backend.model.Feedback;
import edu.strathmore.backend.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;

    public FeedbackServiceImpl(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @Override
    public Feedback createFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    @Override
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    @Override
    public Optional<Feedback> getFeedbackById(Long id) {
        return feedbackRepository.findById(id);
    }

    @Override
    public List<Feedback> getFeedbackByBook(Long bookId) {
        return feedbackRepository.findByBookId(bookId);
    }

    @Override
    public List<Feedback> getFeedbackByUser(Long userId) {
        return feedbackRepository.findByUserId(userId);
    }

    @Override
    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }
}
