package com.sparkfest.backend.dtos.dashboard;

import com.sparkfest.backend.dtos.session.SessionSummaryResponse;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardResponse {

    private Long childId;
    private long totalSessions;
    private long completedSessions;
    private long totalAttempts;
    private long passedAttempts;
    private BigDecimal overallAccuracy;
    private BigDecimal passRate;
    private long uniqueWordsPracticed;
    private long uniqueWordsMastered;
    private List<SessionSummaryResponse> recentSessions;
}