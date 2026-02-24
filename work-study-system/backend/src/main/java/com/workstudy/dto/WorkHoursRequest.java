package com.workstudy.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class WorkHoursRequest {
    @NotNull
    private Long jobId;
    
    @NotNull
    private LocalDate workDate;
    
    @NotNull
    private LocalTime startTime;
    
    @NotNull
    private LocalTime endTime;
    
    private String description;
}
