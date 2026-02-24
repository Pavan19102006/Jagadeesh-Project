package com.workstudy.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    
    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private JobPosting job;
    
    @ManyToOne
    @JoinColumn(name = "given_by", nullable = false)
    private User givenBy;
    
    @Column(nullable = false)
    private Integer rating;
    
    @Column(nullable = false, length = 2000)
    private String comments;
    
    private String performanceAreas;
    
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
