package com.sparkfest.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sparkfest.backend.models.Session;

public interface SessionRepository extends JpaRepository<Session, Long> {

}