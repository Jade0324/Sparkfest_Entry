package com.sparkfest.backend.dtos.session;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class SessionSummaryResponse {

    private Long id;
    private String status;
    private BigDecimal totalScore;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private int exerciseCount;
    private int attemptCount;
}