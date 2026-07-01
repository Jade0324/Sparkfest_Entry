package com.sparkfest.backend.dtos.attempt;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class SubmitAttemptRequest {

    @NotNull(message = "exerciseId is required")
    private Long exerciseId;

    // What the child said — from the frontend's Web Speech API / ASR
    private String transcript;

    // Optional for MVP — frontend may send transcript-only
    private String audioUrl;

    @DecimalMin(value = "0.00", message = "accuracyScore must be >= 0")
    @DecimalMax(value = "100.00", message = "accuracyScore must be <= 100")
    private BigDecimal accuracyScore;

    @AssertTrue(message = "Either transcript or audioUrl must be provided")
    public boolean hasContent() {
        return (transcript != null && !transcript.isBlank())
                || (audioUrl != null && !audioUrl.isBlank());
    }
}