package com.sparkfest.backend.services;

import com.sparkfest.backend.dtos.attempt.AttemptResponse;
import com.sparkfest.backend.dtos.exercise.ExerciseResponse;
import com.sparkfest.backend.dtos.exercise.SessionExerciseResponse;
import com.sparkfest.backend.dtos.session.SessionDetailResponse;
import com.sparkfest.backend.dtos.session.SessionSummaryResponse;
import com.sparkfest.backend.dtos.session.StartSessionRequest;
import com.sparkfest.backend.exceptions.ResourceNotFoundException;
import com.sparkfest.backend.models.Attempt;
import com.sparkfest.backend.models.Exercise;
import com.sparkfest.backend.models.Session;
import com.sparkfest.backend.models.SessionExercise;
import com.sparkfest.backend.repositories.ExerciseRepository;
import com.sparkfest.backend.repositories.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;
    private final ExerciseRepository exerciseRepository;

    @Transactional
    public SessionDetailResponse startSession(StartSessionRequest request) {

        List<Exercise> exercises = exerciseRepository.findAllById(request.getExerciseIds());

        if (exercises.size() != request.getExerciseIds().size()) {
            throw new ResourceNotFoundException("One or more exercise IDs do not exist");
        }

        Map<Long, Exercise> exerciseById = exercises.stream()
                .collect(Collectors.toMap(Exercise::getId, e -> e));

        Session session = Session.builder()
                .childId(request.getChildId())
                .build();

        session.start();

        List<Long> orderedIds = request.getExerciseIds();
        for (short i = 0; i < orderedIds.size(); i++) {
            Exercise exercise = exerciseById.get(orderedIds.get(i));

            SessionExercise sessionExercise = SessionExercise.builder()
                    .session(session)
                    .exercise(exercise)
                    .sequenceOrder(i)
                    .build();

            session.getSessionExercises().add(sessionExercise);
        }

        Session saved = sessionRepository.save(session);

        return toDetailResponse(saved);
    }

    @Transactional(readOnly = true)
    public SessionDetailResponse getSession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> ResourceNotFoundException.of("Session", sessionId));

        return toDetailResponse(session);
    }

    @Transactional
    public SessionSummaryResponse completeSession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> ResourceNotFoundException.of("Session", sessionId));

        if (session.getStatus() == Session.SessionStatus.COMPLETED) {
            throw new IllegalStateException("Session is already completed");
        }

        BigDecimal computedScore = computeTotalScore(session);
        session.complete(computedScore);

        Session saved = sessionRepository.save(session);

        return SessionSummaryResponse.builder()
                .id(saved.getId())
                .status(saved.getStatus().name())
                .completedAt(saved.getCompletedAt())
                .totalScore(saved.getTotalScore())
                .build();
    }

    // ── Helpers ────────────────────────────────────────────

    private BigDecimal computeTotalScore(Session session) {
        List<Attempt> attempts = session.getAttempts();

        if (attempts.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal sum = attempts.stream()
                .map(Attempt::getAccuracyScore)
                .filter(score -> score != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long scoredCount = attempts.stream()
                .filter(a -> a.getAccuracyScore() != null)
                .count();

        if (scoredCount == 0) {
            return BigDecimal.ZERO;
        }

        return sum.divide(BigDecimal.valueOf(scoredCount), 2, RoundingMode.HALF_UP);
    }

    private SessionDetailResponse toDetailResponse(Session session) {
        List<SessionExerciseResponse> exerciseResponses = session.getSessionExercises().stream()
                .map(this::toSessionExerciseResponse)
                .collect(Collectors.toList());

        List<AttemptResponse> attemptResponses = session.getAttempts().stream()
                .map(this::toAttemptResponse)
                .collect(Collectors.toList());

        return SessionDetailResponse.builder()
                .id(session.getId())
                .childId(session.getChildId())
                .status(session.getStatus().name())
                .startedAt(session.getStartedAt())
                .completedAt(session.getCompletedAt())
                .totalScore(session.getTotalScore())
                .exercises(exerciseResponses)
                .attempts(attemptResponses)
                .build();
    }

    private SessionExerciseResponse toSessionExerciseResponse(SessionExercise sessionExercise) {
        Exercise exercise = sessionExercise.getExercise();

        ExerciseResponse exerciseResponse = ExerciseResponse.builder()
                .id(exercise.getId())
                .targetWord(exercise.getTargetWord())
                .phonemeFocus(exercise.getPhonemeFocus())
                .difficulty(exercise.getDifficulty())
                .mediaUrl(exercise.getMediaUrl())
                .instructions(exercise.getInstructions())
                .build();

        return SessionExerciseResponse.builder()
                .sequenceOrder(sessionExercise.getSequenceOrder())
                .exercise(exerciseResponse)
                .build();
    }

    private AttemptResponse toAttemptResponse(Attempt attempt) {
        return AttemptResponse.builder()
                .id(attempt.getId())
                .sessionId(attempt.getSession().getId())
                .exerciseId(attempt.getExercise().getId())
                .attemptNumber(attempt.getAttemptNumber())
                .audioUrl(attempt.getAudioUrl())
                .accuracyScore(attempt.getAccuracyScore())
                .aiFeedback(attempt.getAiFeedback())
                .aiFeedbackAudioUrl(attempt.getAiFeedbackAudioUrl())
                .passed(attempt.getPassed())
                .recordedAt(attempt.getRecordedAt())
                .evaluatedAt(attempt.getEvaluatedAt())
                .build();
    }
}