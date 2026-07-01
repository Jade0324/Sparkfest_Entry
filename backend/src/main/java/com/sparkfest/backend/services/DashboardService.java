package com.sparkfest.backend.services;

import com.sparkfest.backend.dtos.dashboard.DashboardResponse;
import com.sparkfest.backend.dtos.session.SessionSummaryResponse;
import com.sparkfest.backend.models.Attempt;
import com.sparkfest.backend.models.Session;
import com.sparkfest.backend.repositories.AttemptRepository;
import com.sparkfest.backend.repositories.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AttemptRepository attemptRepository;
    private final SessionRepository sessionRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(Long childId) {
        long totalSessions = sessionRepository.countByChildId(childId);
        long completedSessions = sessionRepository.countByChildIdAndStatus(
                childId, Session.SessionStatus.COMPLETED);

        long totalAttempts = attemptRepository.countByChildId(childId);
        long passedAttempts = attemptRepository.countPassedByChildId(childId);

        Optional<BigDecimal> avgAccuracy = attemptRepository.findAverageAccuracyByChildId(childId);

        BigDecimal passRate = totalAttempts > 0
                ? BigDecimal.valueOf((double) passedAttempts / totalAttempts * 100)
                        .setScale(2, RoundingMode.HALF_UP)
                : null;

        List<Attempt> latestPerExercise = attemptRepository
                .findLatestAttemptPerExerciseByChildId(childId);

        long uniqueWordsPracticed = latestPerExercise.size();
        long uniqueWordsMastered = latestPerExercise.stream()
                .filter(a -> Boolean.TRUE.equals(a.getPassed()))
                .count();

        List<Session> recent = sessionRepository.findRecentByChildId(
                childId, PageRequest.of(0, 5));

        List<SessionSummaryResponse> recentSessions = recent.stream()
                .map(s -> SessionSummaryResponse.builder()
                        .id(s.getId())
                        .status(s.getStatus().name())
                        .totalScore(s.getTotalScore())
                        .startedAt(s.getStartedAt())
                        .completedAt(s.getCompletedAt())
                        .exerciseCount(s.getSessionExercises().size())
                        .attemptCount(s.getAttempts().size())
                        .build())
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .childId(childId)
                .totalSessions(totalSessions)
                .completedSessions(completedSessions)
                .totalAttempts(totalAttempts)
                .passedAttempts(passedAttempts)
                .overallAccuracy(avgAccuracy.orElse(null))
                .passRate(passRate)
                .uniqueWordsPracticed(uniqueWordsPracticed)
                .uniqueWordsMastered(uniqueWordsMastered)
                .recentSessions(recentSessions)
                .build();
    }
}