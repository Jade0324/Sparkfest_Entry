package com.sparkfest.backend.services;

import com.sparkfest.backend.dtos.exercise.CreateExerciseRequest;
import com.sparkfest.backend.dtos.exercise.ExerciseResponse;
import com.sparkfest.backend.exceptions.ResourceNotFoundException;
import com.sparkfest.backend.models.Exercise;
import com.sparkfest.backend.repositories.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;

    // ── CREATE ────────────────────────────────────────────
    @Transactional
    public ExerciseResponse createExercise(CreateExerciseRequest request) {
        Exercise exercise = Exercise.builder()
                .targetWord(request.getTargetWord())
                .nativeWord(request.getNativeWord())
                .phonemeFocus(request.getPhonemeFocus())
                .difficulty(request.getDifficulty())
                .mediaUrl(request.getMediaUrl())
                .instructions(request.getInstructions())
                .build();

        return toExerciseResponse(exerciseRepository.save(exercise));
    }

    // ── READ ONE ──────────────────────────────────────────
    @Transactional(readOnly = true)
    public ExerciseResponse getExercise(Long id) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Exercise", id));
        return toExerciseResponse(exercise);
    }

    // ── LIST (paginated, optional difficulty filter) ──────
    @Transactional(readOnly = true)
    public Page<ExerciseResponse> listExercises(Short difficulty, Pageable pageable) {
        Page<Exercise> page = (difficulty != null)
                ? exerciseRepository.findByDifficultyAndIsActiveTrue(difficulty, pageable)
                : exerciseRepository.findByIsActiveTrue(pageable);

        return page.map(this::toExerciseResponse);
    }

    // ── Mapper ────────────────────────────────────────────
    public ExerciseResponse toExerciseResponse(Exercise exercise) {
        return ExerciseResponse.builder()
                .id(exercise.getId())
                .targetWord(exercise.getTargetWord())
                .nativeWord(exercise.getNativeWord())
                .phonemeFocus(exercise.getPhonemeFocus())
                .difficulty(exercise.getDifficulty())
                .mediaUrl(exercise.getMediaUrl())
                .instructions(exercise.getInstructions())
                .build();
    }
}