package com.workstudy.repository;

import com.workstudy.entity.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
    List<JobPosting> findByStatus(JobPosting.Status status);
    List<JobPosting> findByPostedById(Long postedById);
    List<JobPosting> findByDepartment(String department);
}
