package com.sparkfest.backend.dtos.dictionary;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class DictionaryEntryResponse {

    private Long exerciseId;
    private String targetWord;
    private String nativeWord;
    private String phonemeFocus;
    private Short difficulty;
    private String mediaUrl;
    private long attemptCount;
    private BigDecimal bestAccuracy;
    private BigDecimal latestAccuracy;
    private String latestTranscript; // what the child last said
    private boolean mastered;
    private LocalDateTime lastAttemptedAt;

    // HIGH (<60%) → MEDIUM (60-79%) → LOW (≥80%)
    private String priority;
}