package com.sparkfest.backend.repositories;

import com.sparkfest.backend.models.Exercise;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    Page<Exercise> findByIsActiveTrue(Pageable pageable);

    Page<Exercise> findByDifficultyAndIsActiveTrue(Short difficulty, Pageable pageable);

    Page<Exercise> findByDifficulty(Short difficulty, Pageable pageable);
}