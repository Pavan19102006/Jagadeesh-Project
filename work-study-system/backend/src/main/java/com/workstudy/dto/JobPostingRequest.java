package com.workstudy.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class JobPostingRequest {
    @NotBlank
    private String title;
    
    @NotBlank
    @Size(max = 2000)
    private String description;
    
    @NotBlank
    private String department;
    
    @NotBlank
    private String location;
    
    @NotNull
    @DecimalMin("0.00")
    private BigDecimal hourlyRate;
    
    @NotNull
    @Min(1)
    @Max(40)
    private Integer maxHoursPerWeek;
    
    @NotNull
    @Min(1)
    private Integer totalPositions;
    
    @NotNull
    private LocalDate applicationDeadline;
}
