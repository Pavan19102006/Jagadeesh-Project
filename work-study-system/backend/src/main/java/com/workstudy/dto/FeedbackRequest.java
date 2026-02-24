package com.workstudy.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class FeedbackRequest {
    @NotNull
    private Long studentId;
    
    @NotNull
    private Long jobId;
    
    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;
    
    @NotBlank
    private String comments;
    
    private String performanceAreas;
}
