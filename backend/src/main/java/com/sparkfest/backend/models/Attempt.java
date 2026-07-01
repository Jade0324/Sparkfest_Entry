package com.sparkfest.backend.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "attempts", indexes = {
        @Index(name = "idx_attempts_session_exercise", columnList = "session_id, exercise_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @Column(name = "attempt_number", nullable = false)
    @Builder.Default
    private Short attemptNumber = 1;

    @Column(name = "audio_url", length = 512)
    private String audioUrl;

    @Column(name = "transcript", columnDefinition = "TEXT")
    private String transcript;

    @Column(name = "accuracy_score", precision = 5, scale = 2)
    private BigDecimal accuracyScore;

    @Column(name = "ai_feedback", columnDefinition = "TEXT")
    private String aiFeedback;

    @Column(name = "ai_feedback_audio_url", length = 512)
    private String aiFeedbackAudioUrl;

    @Column(name = "passed")
    private Boolean passed;

    @Column(name = "recorded_at", nullable = false)
    @Builder.Default
    private LocalDateTime recordedAt = LocalDateTime.now();

    @Column(name = "evaluated_at")
    private LocalDateTime evaluatedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public void applyFeedback(String feedback, String feedbackAudioUrl, boolean didPass) {
        this.aiFeedback = feedback;
        this.aiFeedbackAudioUrl = feedbackAudioUrl;
        this.passed = didPass;
        this.evaluatedAt = LocalDateTime.now();
    }
}