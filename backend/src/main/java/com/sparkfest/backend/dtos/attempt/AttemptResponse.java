package com.sparkfest.backend.dtos.attempt;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class AttemptResponse {

    private Long id;
    private Long sessionId;
    private Long exerciseId;
    private String targetWord;
    private String nativeWord;
    private Short attemptNumber;
    private String transcript;
    private String audioUrl;
    private BigDecimal accuracyScore;
    private String aiFeedback;
    private String aiFeedbackAudioUrl;
    private Boolean passed;
    private LocalDateTime recordedAt;
    private LocalDateTime evaluatedAt;
}