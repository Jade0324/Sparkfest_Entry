package com.sparkfest.backend.repositories;

import com.sparkfest.backend.models.Attempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface AttemptRepository extends JpaRepository<Attempt, Long> {

        List<Attempt> findBySession_Id(Long sessionId);

        @Query("SELECT COALESCE(MAX(a.attemptNumber), 0) FROM Attempt a " +
                        "WHERE a.session.id = :sessionId AND a.exercise.id = :exerciseId")
        Short findMaxAttemptNumber(@Param("sessionId") Long sessionId,
                        @Param("exerciseId") Long exerciseId);

        @Query("SELECT a FROM Attempt a JOIN FETCH a.exercise " +
                        "WHERE a.session.childId = :childId ORDER BY a.recordedAt DESC")
        List<Attempt> findAllByChildId(@Param("childId") Long childId);

        @Query("SELECT COUNT(a) FROM Attempt a WHERE a.session.childId = :childId")
        long countByChildId(@Param("childId") Long childId);

        @Query("SELECT COUNT(a) FROM Attempt a WHERE a.session.childId = :childId AND a.passed = true")
        long countPassedByChildId(@Param("childId") Long childId);

        @Query("SELECT AVG(a.accuracyScore) FROM Attempt a " +
                        "WHERE a.session.childId = :childId AND a.accuracyScore IS NOT NULL")
        Optional<BigDecimal> findAverageAccuracyByChildId(@Param("childId") Long childId);

        @Query("""
                        SELECT a FROM Attempt a JOIN FETCH a.exercise e
                        WHERE a.session.childId = :childId
                          AND a.recordedAt = (
                              SELECT MAX(a2.recordedAt) FROM Attempt a2
                              WHERE a2.session.childId = :childId AND a2.exercise.id = e.id
                          )
                        ORDER BY e.targetWord ASC
                        """)
        List<Attempt> findLatestAttemptPerExerciseByChildId(@Param("childId") Long childId);

        @Query("SELECT a.exercise.id, MAX(a.accuracyScore) FROM Attempt a " +
                        "WHERE a.session.childId = :childId AND a.accuracyScore IS NOT NULL " +
                        "GROUP BY a.exercise.id")
        List<Object[]> findBestAccuracyPerExerciseByChildId(@Param("childId") Long childId);

        @Query("SELECT a.exercise.id, COUNT(a) FROM Attempt a " +
                        "WHERE a.session.childId = :childId GROUP BY a.exercise.id")
        List<Object[]> findAttemptCountPerExerciseByChildId(@Param("childId") Long childId);

        @Query("SELECT a FROM Attempt a " +
                        "JOIN FETCH a.exercise " +
                        "JOIN FETCH a.session " +
                        "WHERE a.session.id = :sessionId " +
                        "ORDER BY a.recordedAt ASC")
        List<Attempt> findBySessionIdOrderByRecordedAtAsc(@Param("sessionId") Long sessionId);
}