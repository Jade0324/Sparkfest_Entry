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

    // ── Core identity ───────────────────────────────────────

    @Column(name = "target_word", nullable = false, length = 120)
    private String targetWord;

    @Column(name = "phoneme_focus", length = 60)
    private String phonemeFocus;

    @Builder.Default
    @Column(nullable = false)
    private Short difficulty = 1; // 1–5

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    // ── Level 1 — Single Word ───────────────────────────────
    // e.g. prompt: "What animal is this?", target: "Dog"

    @Column(name = "level1_prompt", length = 255)
    private String level1Prompt;

    @Column(name = "level1_text", length = 120)
    private String level1Text;

    @Column(name = "level1_image_url", length = 512)
    private String level1ImageUrl;

    // ── Level 2 — Phrase ────────────────────────────────────
    // e.g. prompt: "What is the dog doing?", target: "Dog is eating"

    @Column(name = "level2_prompt", length = 255)
    private String level2Prompt;

    @Column(name = "level2_text", length = 255)
    private String level2Text;

    @Column(name = "level2_image_url", length = 512)
    private String level2ImageUrl;

    // ── Level 3 — Full Sentence ─────────────────────────────
    // e.g. prompt: "What is the dog eating?", target: "The dog is eating the bone"

    @Column(name = "level3_prompt", length = 255)
    private String level3Prompt;

    @Column(name = "level3_text", length = 255)
    private String level3Text;

    @Column(name = "level3_image_url", length = 512)
    private String level3ImageUrl;

    // ── Legacy single mediaUrl (kept for backward compat) ───
    // Used as fallback if level-specific images are null

    @Column(name = "media_url", length = 512)
    private String mediaUrl;

    // ── Relationships ───────────────────────────────────────

    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<SessionExercise> sessionExercises = new ArrayList<>();

    // ── Audit ───────────────────────────────────────────────

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    private String nativeWord;
}