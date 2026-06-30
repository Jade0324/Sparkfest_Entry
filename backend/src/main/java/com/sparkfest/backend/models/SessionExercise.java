package com.sparkfest.backend.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "session_exercises", uniqueConstraints = @UniqueConstraint(columnNames = { "session_id", "exercise_id" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @Column(name = "sequence_order", nullable = false)
    private Short sequenceOrder = 0;
}