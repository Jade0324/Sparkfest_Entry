package com.sparkfest.backend.services;

import com.sparkfest.backend.dtos.exercise.ExerciseResponse;
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

    @Transactional(readOnly = true)
    public Page<ExerciseResponse> listExercises(Short difficulty, Pageable pageable) {
        Page<Exercise> page = (difficulty != null)
                ? exerciseRepository.findByDifficulty(difficulty, pageable)
                : exerciseRepository.findAll(pageable);

        return page.map(this::toExerciseResponse);
    }

    private ExerciseResponse toExerciseResponse(Exercise exercise) {
        return ExerciseResponse.builder()
                .id(exercise.getId())
                .targetWord(exercise.getTargetWord())
                .phonemeFocus(exercise.getPhonemeFocus())
                .difficulty(exercise.getDifficulty())
                .mediaUrl(exercise.getMediaUrl())
                .instructions(exercise.getInstructions())
                .build();
    }
}