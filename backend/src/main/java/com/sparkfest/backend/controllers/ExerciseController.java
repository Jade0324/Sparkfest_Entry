package com.sparkfest.backend.controllers;

import com.sparkfest.backend.dtos.exercise.ExerciseResponse;
import com.sparkfest.backend.services.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    /**
     * GET /api/v1/exercises?difficulty=1&page=0&size=20
     * Paginated catalogue; `difficulty` filter is optional.
     */
    @GetMapping
    public ResponseEntity<Page<ExerciseResponse>> listExercises(
            @RequestParam(required = false) Short difficulty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("difficulty", "targetWord"));
        return ResponseEntity.ok(exerciseService.listExercises(difficulty, pageable));
    }
}