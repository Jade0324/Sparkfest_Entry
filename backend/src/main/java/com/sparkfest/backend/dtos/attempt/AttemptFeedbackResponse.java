package com.sparkfest.backend.dtos.attempt;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AttemptFeedbackResponse {
    private Long id;
    private String aiFeedback;
    private String aiFeedbackAudioUrl;
    private Boolean passed; // null = still processing
    private LocalDateTime evaluatedAt;
}