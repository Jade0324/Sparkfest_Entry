package com.sparkfest.backend.dtos.attempt;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class SubmitAttemptRequest {

    @NotNull
    private Long exerciseId;

    @NotBlank
    private String audioUrl;

    @NotNull
    @DecimalMin("0.00")
    @DecimalMax("100.00")
    private BigDecimal accuracyScore;
}