package com.workstudy.service;

import com.workstudy.dto.JobPostingRequest;
import com.workstudy.entity.JobPosting;
import com.workstudy.entity.User;
import com.workstudy.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobPostingService {
    private final JobPostingRepository jobPostingRepository;
    
    @Transactional
    public JobPosting createJobPosting(JobPostingRequest request, User postedBy) {
        JobPosting job = new JobPosting();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setDepartment(request.getDepartment());
        job.setLocation(request.getLocation());
        job.setHourlyRate(request.getHourlyRate());
        job.setMaxHoursPerWeek(request.getMaxHoursPerWeek());
        job.setTotalPositions(request.getTotalPositions());
        job.setFilledPositions(0);
        job.setApplicationDeadline(request.getApplicationDeadline());
        job.setStatus(JobPosting.Status.ACTIVE);
        job.setPostedBy(postedBy);
        
        return jobPostingRepository.save(job);
    }
    
    public List<JobPosting> findAll() {
        return jobPostingRepository.findAll();
    }
    
    public List<JobPosting> findActiveJobs() {
        return jobPostingRepository.findByStatus(JobPosting.Status.ACTIVE);
    }
    
    public JobPosting findById(Long id) {
        return jobPostingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job posting not found"));
    }
    
    public List<JobPosting> findByDepartment(String department) {
        return jobPostingRepository.findByDepartment(department);
    }
    
    @Transactional
    public JobPosting updateJobPosting(Long id, JobPostingRequest request) {
        JobPosting job = findById(id);
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setDepartment(request.getDepartment());
        job.setLocation(request.getLocation());
        job.setHourlyRate(request.getHourlyRate());
        job.setMaxHoursPerWeek(request.getMaxHoursPerWeek());
        job.setTotalPositions(request.getTotalPositions());
        job.setApplicationDeadline(request.getApplicationDeadline());
        return jobPostingRepository.save(job);
    }
    
    @Transactional
    public void closeJobPosting(Long id) {
        JobPosting job = findById(id);
        job.setStatus(JobPosting.Status.CLOSED);
        jobPostingRepository.save(job);
    }
    
    @Transactional
    public void incrementFilledPositions(Long id) {
        JobPosting job = findById(id);
        job.setFilledPositions(job.getFilledPositions() + 1);
        if (job.getFilledPositions() >= job.getTotalPositions()) {
            job.setStatus(JobPosting.Status.FILLED);
        }
        jobPostingRepository.save(job);
    }
    
    @Transactional
    public void deleteJobPosting(Long id) {
        jobPostingRepository.deleteById(id);
    }
}
