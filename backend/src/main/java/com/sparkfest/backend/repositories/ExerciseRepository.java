package com.sparkfest.backend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.sparkfest.backend.models.Exercise;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    Page<Exercise> findByDifficulty(Short difficulty, Pageable pageable);
}