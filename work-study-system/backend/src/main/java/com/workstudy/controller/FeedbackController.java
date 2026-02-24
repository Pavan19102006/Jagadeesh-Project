package com.workstudy.controller;

import com.workstudy.dto.FeedbackRequest;
import com.workstudy.entity.Feedback;
import com.workstudy.entity.User;
import com.workstudy.service.FeedbackService;
import com.workstudy.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FeedbackController {
    private final FeedbackService feedbackService;
    private final UserService userService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.findAll());
    }
    
    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Feedback>> getMyFeedback(Authentication authentication) {
        User student = userService.findByUsername(authentication.getName());
        return ResponseEntity.ok(feedbackService.findByStudent(student.getId()));
    }
    
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Feedback>> getFeedbackByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(feedbackService.findByStudent(studentId));
    }
    
    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Feedback>> getFeedbackByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(feedbackService.findByJob(jobId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable Long id) {
        return ResponseEntity.ok(feedbackService.findById(id));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Feedback> createFeedback(@Valid @RequestBody FeedbackRequest request, Authentication authentication) {
        User admin = userService.findByUsername(authentication.getName());
        return ResponseEntity.ok(feedbackService.createFeedback(request, admin));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.ok().build();
    }
}
