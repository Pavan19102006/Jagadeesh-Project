package com.workstudy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplicationRequest {
    @NotNull
    private Long jobId;
    
    @NotBlank
    private String coverLetter;
    
    private String resumeUrl;
}
