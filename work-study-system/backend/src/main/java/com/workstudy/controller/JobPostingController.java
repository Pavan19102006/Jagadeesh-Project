package com.workstudy.controller;

import com.workstudy.dto.JobPostingRequest;
import com.workstudy.entity.JobPosting;
import com.workstudy.entity.User;
import com.workstudy.service.JobPostingService;
import com.workstudy.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class JobPostingController {
    private final JobPostingService jobPostingService;
    private final UserService userService;
    
    @GetMapping
    public ResponseEntity<List<JobPosting>> getAllJobs() {
        return ResponseEntity.ok(jobPostingService.findAll());
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<JobPosting>> getActiveJobs() {
        return ResponseEntity.ok(jobPostingService.findActiveJobs());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<JobPosting> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobPostingService.findById(id));
    }
    
    @GetMapping("/department/{department}")
    public ResponseEntity<List<JobPosting>> getJobsByDepartment(@PathVariable String department) {
        return ResponseEntity.ok(jobPostingService.findByDepartment(department));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<JobPosting> createJob(@Valid @RequestBody JobPostingRequest request, Authentication authentication) {
        User admin = userService.findByUsername(authentication.getName());
        return ResponseEntity.ok(jobPostingService.createJobPosting(request, admin));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<JobPosting> updateJob(@PathVariable Long id, @Valid @RequestBody JobPostingRequest request) {
        return ResponseEntity.ok(jobPostingService.updateJobPosting(id, request));
    }
    
    @PatchMapping("/{id}/close")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> closeJob(@PathVariable Long id) {
        jobPostingService.closeJobPosting(id);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        jobPostingService.deleteJobPosting(id);
        return ResponseEntity.ok().build();
    }
}
