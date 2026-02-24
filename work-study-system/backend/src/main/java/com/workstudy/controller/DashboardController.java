package com.workstudy.controller;

import com.workstudy.entity.User;
import com.workstudy.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {
    private final UserService userService;
    private final JobPostingService jobPostingService;
    private final ApplicationService applicationService;
    private final WorkHoursService workHoursService;
    private final FeedbackService feedbackService;
    
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        dashboard.put("totalStudents", userService.findAllStudents().size());
        dashboard.put("totalJobs", jobPostingService.findAll().size());
        dashboard.put("activeJobs", jobPostingService.findActiveJobs().size());
        dashboard.put("totalApplications", applicationService.findAll().size());
        dashboard.put("pendingApplications", applicationService.findByStatus(com.workstudy.entity.Application.Status.PENDING).size());
        dashboard.put("totalWorkHours", workHoursService.findAll().stream()
                .filter(wh -> wh.getStatus() == com.workstudy.entity.WorkHours.Status.APPROVED)
                .map(wh -> wh.getHoursWorked())
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        
        return ResponseEntity.ok(dashboard);
    }
    
    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getStudentDashboard(Authentication authentication) {
        User student = userService.findByUsername(authentication.getName());
        Map<String, Object> dashboard = new HashMap<>();
        
        dashboard.put("myApplications", applicationService.findByStudent(student.getId()).size());
        dashboard.put("myWorkHours", workHoursService.getTotalHoursForStudent(student.getId()));
        dashboard.put("myFeedback", feedbackService.findByStudent(student.getId()).size());
        dashboard.put("availableJobs", jobPostingService.findActiveJobs().size());
        
        return ResponseEntity.ok(dashboard);
    }
}
