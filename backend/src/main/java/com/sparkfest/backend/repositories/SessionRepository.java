package com.sparkfest.backend.repositories;

import com.sparkfest.backend.models.Session;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SessionRepository extends JpaRepository<Session, Long> {

    List<Session> findByChildIdOrderByCreatedAtDesc(Long childId);

    @Query("SELECT s FROM Session s WHERE s.childId = :childId ORDER BY s.createdAt DESC")
    List<Session> findRecentByChildId(@Param("childId") Long childId, Pageable pageable);

    long countByChildId(Long childId);

    long countByChildIdAndStatus(Long childId, Session.SessionStatus status);
}