package com.workstudy.service;

import com.workstudy.dto.ApplicationRequest;
import com.workstudy.dto.ApplicationStatusRequest;
import com.workstudy.entity.Application;
import com.workstudy.entity.JobPosting;
import com.workstudy.entity.User;
import com.workstudy.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final JobPostingService jobPostingService;
    
    @Transactional
    public Application submitApplication(ApplicationRequest request, User student) {
        JobPosting job = jobPostingService.findById(request.getJobId());
        
        if (job.getStatus() != JobPosting.Status.ACTIVE) {
            throw new RuntimeException("This job is no longer accepting applications");
        }
        
        if (applicationRepository.findByStudentIdAndJobId(student.getId(), job.getId()).isPresent()) {
            throw new RuntimeException("You have already applied for this position");
        }
        
        Application application = new Application();
        application.setStudent(student);
        application.setJob(job);
        application.setCoverLetter(request.getCoverLetter());
        application.setResumeUrl(request.getResumeUrl());
        application.setStatus(Application.Status.PENDING);
        
        return applicationRepository.save(application);
    }
    
    public List<Application> findByStudent(Long studentId) {
        return applicationRepository.findByStudentId(studentId);
    }
    
    public List<Application> findByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }
    
    public List<Application> findAll() {
        return applicationRepository.findAll();
    }
    
    public List<Application> findByStatus(Application.Status status) {
        return applicationRepository.findByStatus(status);
    }
    
    public Application findById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }
    
    @Transactional
    public Application updateStatus(Long id, ApplicationStatusRequest request, User admin) {
        Application application = findById(id);
        application.setStatus(Application.Status.valueOf(request.getStatus()));
        application.setAdminNotes(request.getAdminNotes());
        application.setReviewedAt(LocalDateTime.now());
        application.setReviewedBy(admin);
        
        if (application.getStatus() == Application.Status.APPROVED) {
            jobPostingService.incrementFilledPositions(application.getJob().getId());
        }
        
        return applicationRepository.save(application);
    }
    
    @Transactional
    public void withdrawApplication(Long id, User student) {
        Application application = findById(id);
        if (!application.getStudent().getId().equals(student.getId())) {
            throw new RuntimeException("You can only withdraw your own applications");
        }
        application.setStatus(Application.Status.WITHDRAWN);
        applicationRepository.save(application);
    }
}
