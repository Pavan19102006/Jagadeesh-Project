package com.workstudy.controller;

import com.workstudy.dto.WorkHoursRequest;
import com.workstudy.dto.WorkHoursStatusRequest;
import com.workstudy.entity.User;
import com.workstudy.entity.WorkHours;
import com.workstudy.service.UserService;
import com.workstudy.service.WorkHoursService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/workhours")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WorkHoursController {
    private final WorkHoursService workHoursService;
    private final UserService userService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<WorkHours>> getAllWorkHours() {
        return ResponseEntity.ok(workHoursService.findAll());
    }
    
    @GetMapping("/my")
    public ResponseEntity<List<WorkHours>> getMyWorkHours(Authentication authentication) {
        User student = userService.findByUsername(authentication.getName());
        return ResponseEntity.ok(workHoursService.findByStudent(student.getId()));
    }
    
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<WorkHours>> getWorkHoursByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(workHoursService.findByStudent(studentId));
    }
    
    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<WorkHours>> getWorkHoursByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(workHoursService.findByJob(jobId));
    }
    
    @GetMapping("/my/total")
    public ResponseEntity<BigDecimal> getMyTotalHours(Authentication authentication) {
        User student = userService.findByUsername(authentication.getName());
        return ResponseEntity.ok(workHoursService.getTotalHoursForStudent(student.getId()));
    }
    
    @GetMapping("/student/{studentId}/total")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BigDecimal> getStudentTotalHours(@PathVariable Long studentId) {
        return ResponseEntity.ok(workHoursService.getTotalHoursForStudent(studentId));
    }
    
    @GetMapping("/my/range")
    public ResponseEntity<List<WorkHours>> getMyWorkHoursByDateRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate,
            Authentication authentication) {
        User student = userService.findByUsername(authentication.getName());
        return ResponseEntity.ok(workHoursService.findByDateRange(student.getId(), startDate, endDate));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<WorkHours> logWorkHours(@Valid @RequestBody WorkHoursRequest request, Authentication authentication) {
        User student = userService.findByUsername(authentication.getName());
        return ResponseEntity.ok(workHoursService.logWorkHours(request, student));
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WorkHours> updateWorkHoursStatus(@PathVariable Long id, @Valid @RequestBody WorkHoursStatusRequest request, Authentication authentication) {
        User admin = userService.findByUsername(authentication.getName());
        return ResponseEntity.ok(workHoursService.updateStatus(id, request, admin));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<WorkHours> updateWorkHours(@PathVariable Long id, @Valid @RequestBody WorkHoursRequest request) {
        return ResponseEntity.ok(workHoursService.updateWorkHours(id, request));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> deleteWorkHours(@PathVariable Long id) {
        workHoursService.deleteWorkHours(id);
        return ResponseEntity.ok().build();
    }
}
