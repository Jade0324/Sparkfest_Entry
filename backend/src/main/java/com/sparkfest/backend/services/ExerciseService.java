package com.sparkfest.backend.services;

import com.sparkfest.backend.dtos.exercise.CreateExerciseRequest;
import com.sparkfest.backend.dtos.exercise.ExerciseResponse;
import com.sparkfest.backend.models.Exercise;
import com.sparkfest.backend.repositories.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;

    @Transactional(readOnly = true)
    public Page<ExerciseResponse> listExercises(Short difficulty, String category, Pageable pageable) {
        Page<Exercise> page;

        if (category != null && !category.isBlank()) {
            page = exerciseRepository.findByCategoryAndIsActiveTrue(category, pageable);
        } else if (difficulty != null) {
            page = exerciseRepository.findByDifficulty(difficulty, pageable);
        } else {
            page = exerciseRepository.findAll(pageable);
        }

        return page.map(this::toExerciseResponse);
    }

    @Transactional(readOnly = true)
    public List<String> getCategories() {
        return exerciseRepository.findDistinctCategories();
    }

    public ExerciseResponse getExercise(Long id) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        return toExerciseResponse(exercise);
    }

    @Transactional
    public ExerciseResponse createExercise(CreateExerciseRequest request) {
        Exercise exercise = Exercise.builder()
                .targetWord(request.getTargetWord())
                .nativeWord(request.getNativeWord())
                .phonemeFocus(request.getPhonemeFocus())
                .category(request.getCategory())
                .difficulty(request.getDifficulty())
                .mediaUrl(request.getMediaUrl())
                .instructions(request.getInstructions())

                // Level 1
                .level1Prompt(request.getLevel1Prompt())
                .level1Text(request.getLevel1Text())
                .level1ImageUrl(request.getLevel1ImageUrl())

                // Level 2
                .level2Prompt(request.getLevel2Prompt())
                .level2Text(request.getLevel2Text())
                .level2ImageUrl(request.getLevel2ImageUrl())

                // Level 3
                .level3Prompt(request.getLevel3Prompt())
                .level3Text(request.getLevel3Text())
                .level3ImageUrl(request.getLevel3ImageUrl())
                .build();

        Exercise saved = exerciseRepository.save(exercise);

        return toExerciseResponse(saved);
    }

    // The single, master mapper for the whole service
    private ExerciseResponse toExerciseResponse(Exercise exercise) {
        return ExerciseResponse.builder()
                .id(exercise.getId())
                .targetWord(exercise.getTargetWord())
                .phonemeFocus(exercise.getPhonemeFocus())
                .difficulty(exercise.getDifficulty())
                .mediaUrl(exercise.getMediaUrl())
                .instructions(exercise.getInstructions())
                .level1Prompt(exercise.getLevel1Prompt())
                .level1Text(exercise.getLevel1Text())
                .level1ImageUrl(exercise.getLevel1ImageUrl())
                .level2Prompt(exercise.getLevel2Prompt())
                .level2Text(exercise.getLevel2Text())
                .level2ImageUrl(exercise.getLevel2ImageUrl())
                .level3Prompt(exercise.getLevel3Prompt())
                .level3Text(exercise.getLevel3Text())
                .level3ImageUrl(exercise.getLevel3ImageUrl())
                .build();
    }
}