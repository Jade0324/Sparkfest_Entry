package com.sparkfest.backend.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "exercises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "target_word", nullable = false, length = 120)
    private String targetWord;

    // Tagalog equivalent shown on the bilingual learning card
    // e.g. targetWord = "Fish", nativeWord = "Isda"
    @Column(name = "native_word", length = 120)
    private String nativeWord;

    @Column(name = "phoneme_focus", length = 60)
    private String phonemeFocus;

    @Column(nullable = false)
    @Builder.Default
    private Short difficulty = 1;

    @Column(name = "media_url", length = 512)
    private String mediaUrl;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<SessionExercise> sessionExercises = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}