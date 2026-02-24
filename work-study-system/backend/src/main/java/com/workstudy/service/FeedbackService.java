package com.workstudy.service;

import com.workstudy.dto.FeedbackRequest;
import com.workstudy.entity.Feedback;
import com.workstudy.entity.JobPosting;
import com.workstudy.entity.User;
import com.workstudy.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final UserService userService;
    private final JobPostingService jobPostingService;
    
    @Transactional
    public Feedback createFeedback(FeedbackRequest request, User givenBy) {
        User student = userService.findById(request.getStudentId());
        JobPosting job = jobPostingService.findById(request.getJobId());
        
        Feedback feedback = new Feedback();
        feedback.setStudent(student);
        feedback.setJob(job);
        feedback.setGivenBy(givenBy);
        feedback.setRating(request.getRating());
        feedback.setComments(request.getComments());
        feedback.setPerformanceAreas(request.getPerformanceAreas());
        
        return feedbackRepository.save(feedback);
    }
    
    public List<Feedback> findByStudent(Long studentId) {
        return feedbackRepository.findByStudentId(studentId);
    }
    
    public List<Feedback> findByJob(Long jobId) {
        return feedbackRepository.findByJobId(jobId);
    }
    
    public List<Feedback> findAll() {
        return feedbackRepository.findAll();
    }
    
    public Feedback findById(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
    }
    
    @Transactional
    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }
}
