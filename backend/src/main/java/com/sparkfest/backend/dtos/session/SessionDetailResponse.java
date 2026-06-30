package com.sparkfest.backend.dtos.session;

import com.sparkfest.backend.dtos.attempt.AttemptResponse;
import com.sparkfest.backend.dtos.exercise.SessionExerciseResponse;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class SessionDetailResponse {
    private Long id;
    private Long childId;
    private String status;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private BigDecimal totalScore;
    private List<SessionExerciseResponse> exercises;
    private List<AttemptResponse> attempts;
}