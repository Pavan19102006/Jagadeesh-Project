package com.workstudy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class WorkHoursStatusRequest {
    @NotBlank
    private String status;
    
    private String supervisorNotes;
}
