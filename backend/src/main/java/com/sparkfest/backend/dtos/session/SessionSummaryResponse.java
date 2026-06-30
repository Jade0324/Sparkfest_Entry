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
    private LocalDateTime completedAt;
    private BigDecimal totalScore;
}