package com.sparkfest.backend.services;

import com.sparkfest.backend.dtos.attempt.AttemptResponse;
import com.sparkfest.backend.dtos.attempt.SubmitAttemptRequest;
import com.sparkfest.backend.models.Attempt;
import com.sparkfest.backend.models.Exercise;
import com.sparkfest.backend.models.Session;
import com.sparkfest.backend.repositories.AttemptRepository;
import com.sparkfest.backend.repositories.ExerciseRepository;
import com.sparkfest.backend.repositories.SessionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttemptService {

        private final AttemptRepository attemptRepository;
        private final SessionRepository sessionRepository;
        private final ExerciseRepository exerciseRepository;

        @Transactional
        public AttemptResponse submitAttempt(Long sessionId, SubmitAttemptRequest request) {
                Session session = sessionRepository.findById(sessionId)
                                .orElseThrow(() -> new EntityNotFoundException("Session not found: " + sessionId));

                Exercise exercise = exerciseRepository.findById(request.getExerciseId())
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Exercise not found: " + request.getExerciseId()));

                Short nextNumber = (short) (attemptRepository
                                .findMaxAttemptNumber(sessionId, request.getExerciseId()) + 1);

                BigDecimal accuracy = resolveAccuracy(request, exercise.getTargetWord());
                Boolean passed = accuracy != null
                                ? accuracy.compareTo(new BigDecimal("70.00")) >= 0
                                : null;

                Attempt attempt = Attempt.builder()
                                .session(session)
                                .exercise(exercise)
                                .attemptNumber(nextNumber)
                                .transcript(request.getTranscript())
                                .audioUrl(request.getAudioUrl())
                                .accuracyScore(accuracy)
                                .passed(passed)
                                .build();

                attempt = attemptRepository.save(attempt);
                log.debug("Saved attempt #{} session={} exercise='{}' accuracy={} passed={}",
                                nextNumber, sessionId, exercise.getTargetWord(), accuracy, passed);

                return toResponse(attempt);
        }

        private BigDecimal resolveAccuracy(SubmitAttemptRequest request, String targetWord) {
                if (request.getAccuracyScore() != null)
                        return request.getAccuracyScore();
                if (request.getTranscript() != null && !request.getTranscript().isBlank()) {
                        return computeSimpleAccuracy(request.getTranscript().trim(), targetWord.trim());
                }
                return null;
        }

        // Fallback character-level scorer — replace with phonetic scorer later
        private BigDecimal computeSimpleAccuracy(String transcript, String target) {
                String t = transcript.toLowerCase();
                String w = target.toLowerCase();
                if (t.equals(w))
                        return new BigDecimal("100.00");
                int matches = 0;
                int maxLen = Math.max(t.length(), w.length());
                for (int i = 0; i < Math.min(t.length(), w.length()); i++) {
                        if (t.charAt(i) == w.charAt(i))
                                matches++;
                }
                return BigDecimal.valueOf((double) matches / maxLen * 100)
                                .setScale(2, RoundingMode.HALF_UP);
        }

        public AttemptResponse toResponse(Attempt attempt) {
                return AttemptResponse.builder()
                                .id(attempt.getId())
                                .sessionId(attempt.getSession().getId())
                                .exerciseId(attempt.getExercise().getId())
                                .targetWord(attempt.getExercise().getTargetWord())
                                .nativeWord(attempt.getExercise().getNativeWord())
                                .attemptNumber(attempt.getAttemptNumber())
                                .transcript(attempt.getTranscript())
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