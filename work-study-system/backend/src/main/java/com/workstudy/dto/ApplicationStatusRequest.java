package com.workstudy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ApplicationStatusRequest {
    @NotBlank
    private String status;
    
    private String adminNotes;
}
