package com.workstudy.controller;

import com.workstudy.dto.ApplicationRequest;
import com.workstudy.dto.ApplicationStatusRequest;
import com.workstudy.entity.Application;
import com.workstudy.entity.User;
import com.workstudy.service.ApplicationService;
import com.workstudy.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ApplicationController {
    private final ApplicationService applicationService;
    private final UserService userService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Application>> getAllApplications() {
        return ResponseEntity.ok(applicationService.findAll());
    }
    
    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Application>> getMyApplications(Authentication authentication) {
        User student = userService.findByUsername(authentication.getName());
        return ResponseEntity.ok(applicationService.findByStudent(student.getId()));
    }
    
    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Application>> getApplicationsByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.findByJob(jobId));
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Application>> getApplicationsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(applicationService.findByStatus(Application.Status.valueOf(status)));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.findById(id));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Application> submitApplication(@Valid @RequestBody ApplicationRequest request, Authentication authentication) {
        User student = userService.findByUsername(authentication.getName());
        return ResponseEntity.ok(applicationService.submitApplication(request, student));
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Application> updateApplicationStatus(@PathVariable Long id, @Valid @RequestBody ApplicationStatusRequest request, Authentication authentication) {
        User admin = userService.findByUsername(authentication.getName());
        return ResponseEntity.ok(applicationService.updateStatus(id, request, admin));
    }
    
    @PatchMapping("/{id}/withdraw")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> withdrawApplication(@PathVariable Long id, Authentication authentication) {
        User student = userService.findByUsername(authentication.getName());
        applicationService.withdrawApplication(id, student);
        return ResponseEntity.ok().build();
    }
}
