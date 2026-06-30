package com.sparkfest.backend.services;

import com.sparkfest.backend.dtos.attempt.AttemptFeedbackResponse;
import com.sparkfest.backend.dtos.attempt.AttemptResponse;
import com.sparkfest.backend.dtos.attempt.SubmitAttemptRequest;
import com.sparkfest.backend.exceptions.ResourceNotFoundException;
import com.sparkfest.backend.models.Attempt;
import com.sparkfest.backend.models.Exercise;
import com.sparkfest.backend.models.Session;
import com.sparkfest.backend.repositories.AttemptRepository;
import com.sparkfest.backend.repositories.ExerciseRepository;
import com.sparkfest.backend.repositories.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttemptService {

    private final AttemptRepository attemptRepository;
    private final SessionRepository sessionRepository;
    private final ExerciseRepository exerciseRepository;

    @Transactional
    public AttemptResponse submitAttempt(Long sessionId, SubmitAttemptRequest request) {

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> ResourceNotFoundException.of("Session", sessionId));

        Exercise exercise = exerciseRepository.findById(request.getExerciseId())
                .orElseThrow(() -> ResourceNotFoundException.of("Exercise", request.getExerciseId()));

        short nextAttemptNumber = (short) (attemptRepository
                .findMaxAttemptNumber(sessionId, request.getExerciseId())
                .orElse((short) 0) + 1);

        Attempt attempt = Attempt.builder()
                .session(session)
                .exercise(exercise)
                .attemptNumber(nextAttemptNumber)
                .audioUrl(request.getAudioUrl())
                .accuracyScore(request.getAccuracyScore())
                .build();

        Attempt saved = attemptRepository.save(attempt);

        // Synchronous AI evaluation — TODO: replace evaluateWithAi(...) with a real
        // call to the AI feedback service once it exists. Kept synchronous per design
        // decision; endpoint still returns 202 for future-proofing toward async.
        evaluateWithAi(saved);

        Attempt evaluated = attemptRepository.save(saved);

        return toAttemptResponse(evaluated);
    }

    @Transactional(readOnly = true)
    public AttemptFeedbackResponse getFeedback(Long sessionId, Long attemptId) {
        Attempt attempt = attemptRepository.findByIdAndSessionId(attemptId, sessionId)
                .orElseThrow(() -> ResourceNotFoundException.of("Attempt", attemptId));

        return AttemptFeedbackResponse.builder()
                .id(attempt.getId())
                .aiFeedback(attempt.getAiFeedback())
                .aiFeedbackAudioUrl(attempt.getAiFeedbackAudioUrl())
                .passed(attempt.getPassed())
                .evaluatedAt(attempt.getEvaluatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<AttemptResponse> listAttempts(Long sessionId) {
        if (!sessionRepository.existsById(sessionId)) {
            throw ResourceNotFoundException.of("Session", sessionId);
        }

        return attemptRepository.findBySessionIdOrderByRecordedAtAsc(sessionId).stream()
                .map(this::toAttemptResponse)
                .collect(Collectors.toList());
    }

    // ── AI stub ────────────────────────────────────────────

    private void evaluateWithAi(Attempt attempt) {
        BigDecimal score = attempt.getAccuracyScore();

        // TODO: Research-backed threshold required — currently a placeholder.
        // Pivot to a data-driven or clinical-expert-validated grading system.
        boolean didPass = score != null && score.compareTo(new BigDecimal("70.00")) >= 0;

        String feedback = didPass
                ? "Great job! Your pronunciation was clear and accurate."
                : "Keep practicing — try slowing down on the target sound.";

        attempt.applyFeedback(feedback, null, didPass);
    }
    // ── Mapping ────────────────────────────────────────────

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