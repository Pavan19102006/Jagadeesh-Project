package com.workstudy.service;

import com.workstudy.dto.WorkHoursRequest;
import com.workstudy.dto.WorkHoursStatusRequest;
import com.workstudy.entity.JobPosting;
import com.workstudy.entity.User;
import com.workstudy.entity.WorkHours;
import com.workstudy.repository.WorkHoursRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkHoursService {
    private final WorkHoursRepository workHoursRepository;
    private final JobPostingService jobPostingService;
    
    @Transactional
    public WorkHours logWorkHours(WorkHoursRequest request, User student) {
        JobPosting job = jobPostingService.findById(request.getJobId());
        
        long minutes = ChronoUnit.MINUTES.between(request.getStartTime(), request.getEndTime());
        BigDecimal hours = BigDecimal.valueOf(minutes).divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
        
        WorkHours workHours = new WorkHours();
        workHours.setStudent(student);
        workHours.setJob(job);
        workHours.setWorkDate(request.getWorkDate());
        workHours.setStartTime(request.getStartTime());
        workHours.setEndTime(request.getEndTime());
        workHours.setHoursWorked(hours);
        workHours.setDescription(request.getDescription());
        workHours.setStatus(WorkHours.Status.PENDING);
        
        return workHoursRepository.save(workHours);
    }
    
    public List<WorkHours> findByStudent(Long studentId) {
        return workHoursRepository.findByStudentId(studentId);
    }
    
    public List<WorkHours> findByJob(Long jobId) {
        return workHoursRepository.findByJobId(jobId);
    }
    
    public List<WorkHours> findByStudentAndJob(Long studentId, Long jobId) {
        return workHoursRepository.findByStudentIdAndJobId(studentId, jobId);
    }
    
    public List<WorkHours> findAll() {
        return workHoursRepository.findAll();
    }
    
    public WorkHours findById(Long id) {
        return workHoursRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Work hours entry not found"));
    }
    
    public BigDecimal getTotalHoursForStudent(Long studentId) {
        return workHoursRepository.findByStudentId(studentId).stream()
                .filter(wh -> wh.getStatus() == WorkHours.Status.APPROVED)
                .map(WorkHours::getHoursWorked)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    public BigDecimal getTotalHoursForStudentAndJob(Long studentId, Long jobId) {
        return workHoursRepository.findByStudentIdAndJobId(studentId, jobId).stream()
                .filter(wh -> wh.getStatus() == WorkHours.Status.APPROVED)
                .map(WorkHours::getHoursWorked)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    public List<WorkHours> findByDateRange(Long studentId, LocalDate startDate, LocalDate endDate) {
        return workHoursRepository.findByStudentIdAndWorkDateBetween(studentId, startDate, endDate);
    }
    
    @Transactional
    public WorkHours updateStatus(Long id, WorkHoursStatusRequest request, User admin) {
        WorkHours workHours = findById(id);
        workHours.setStatus(WorkHours.Status.valueOf(request.getStatus()));
        workHours.setSupervisorNotes(request.getSupervisorNotes());
        workHours.setApprovedBy(admin);
        workHours.setApprovedAt(LocalDateTime.now());
        
        return workHoursRepository.save(workHours);
    }
    
    @Transactional
    public WorkHours updateWorkHours(Long id, WorkHoursRequest request) {
        WorkHours workHours = findById(id);
        
        long minutes = ChronoUnit.MINUTES.between(request.getStartTime(), request.getEndTime());
        BigDecimal hours = BigDecimal.valueOf(minutes).divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
        
        workHours.setWorkDate(request.getWorkDate());
        workHours.setStartTime(request.getStartTime());
        workHours.setEndTime(request.getEndTime());
        workHours.setHoursWorked(hours);
        workHours.setDescription(request.getDescription());
        
        return workHoursRepository.save(workHours);
    }
    
    @Transactional
    public void deleteWorkHours(Long id) {
        workHoursRepository.deleteById(id);
    }
}
