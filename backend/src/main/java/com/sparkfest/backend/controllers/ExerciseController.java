package com.sparkfest.backend.controllers;

import com.sparkfest.backend.dtos.exercise.CreateExerciseRequest;
import com.sparkfest.backend.dtos.exercise.ExerciseResponse;
import com.sparkfest.backend.services.ExerciseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    /** POST /api/v1/exercises — create a new exercise */
    @PostMapping
    public ResponseEntity<ExerciseResponse> createExercise(
            @Valid @RequestBody CreateExerciseRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(exerciseService.createExercise(request));
    }

    /** GET /api/v1/exercises/categories — distinct category names */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(exerciseService.getCategories());
    }

    /** GET /api/v1/exercises/{id} — get one exercise */
    @GetMapping("/{id}")
    public ResponseEntity<ExerciseResponse> getExercise(@PathVariable Long id) {
        return ResponseEntity.ok(exerciseService.getExercise(id));
    }

    /** GET /api/v1/exercises?category=Animals&difficulty=1&page=0&size=20 */
    @GetMapping
    public ResponseEntity<Page<ExerciseResponse>> listExercises(
            @RequestParam(required = false) Short difficulty,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("difficulty", "targetWord"));
        return ResponseEntity.ok(exerciseService.listExercises(difficulty, category, pageable));
    }
}