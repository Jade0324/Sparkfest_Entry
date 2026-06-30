package com.sparkfest.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sparkfest.backend.models.SessionExercise;

public interface SessionExerciseRepository extends JpaRepository<SessionExercise, Long> {

}