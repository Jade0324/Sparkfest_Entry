package com.sparkfest.backend.repositories;

import com.sparkfest.backend.models.Exercise;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    Page<Exercise> findByIsActiveTrue(Pageable pageable);

    Page<Exercise> findByDifficultyAndIsActiveTrue(Short difficulty, Pageable pageable);

    Page<Exercise> findByDifficulty(Short difficulty, Pageable pageable);

    // ── Category queries ────────────────────────────────────

    Page<Exercise> findByCategoryAndIsActiveTrue(String category, Pageable pageable);

    @Query("SELECT DISTINCT e.category FROM Exercise e " +
            "WHERE e.category IS NOT NULL AND e.isActive = true " +
            "ORDER BY e.category ASC")
    List<String> findDistinctCategories();
}