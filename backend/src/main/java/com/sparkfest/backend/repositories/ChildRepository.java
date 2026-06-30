package com.sparkfest.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sparkfest.backend.models.Child;

public interface ChildRepository extends JpaRepository<Child, Long> {
}