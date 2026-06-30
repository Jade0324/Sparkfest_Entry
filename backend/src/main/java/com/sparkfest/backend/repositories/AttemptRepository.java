package com.sparkfest.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sparkfest.backend.models.Attempt;

import java.util.List;
import java.util.Optional;

public interface AttemptRepository extends JpaRepository<Attempt, Long> {

    List<Attempt> findBySessionIdOrderByRecordedAtAsc(Long sessionId);

    @org.springframework.data.jpa.repository.Query("SELECT MAX(a.attemptNumber) FROM Attempt a WHERE a.session.id = :sessionId AND a.exercise.id = :exerciseId")
    Optional<Short> findMaxAttemptNumber(Long sessionId, Long exerciseId);

    Optional<Attempt> findByIdAndSessionId(Long id, Long sessionId);
}