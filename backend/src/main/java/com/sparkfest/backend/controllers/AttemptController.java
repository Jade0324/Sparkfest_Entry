package com.sparkfest.backend.controllers;

import com.sparkfest.backend.dtos.attempt.*;
import com.sparkfest.backend.services.AttemptService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sessions/{sessionId}/attempts")
@RequiredArgsConstructor
public class AttemptController {

    private final AttemptService attemptService;

    /**
     * POST /api/v1/sessions/{sessionId}/attempts
     * Submit audio URL + accuracy score; AI feedback is async → 202.
     */
    @PostMapping
    public ResponseEntity<AttemptResponse> submitAttempt(
            @PathVariable Long sessionId,
            @Valid @RequestBody SubmitAttemptRequest request) {
        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(attemptService.submitAttempt(sessionId, request));
    }

    /**
     * GET /api/v1/sessions/{sessionId}/attempts/{attemptId}/feedback
     * Poll until `passed` is non-null (AI evaluation complete).
     */
    @GetMapping("/{attemptId}/feedback")
    public ResponseEntity<AttemptFeedbackResponse> getFeedback(
            @PathVariable Long sessionId,
            @PathVariable Long attemptId) {
        return ResponseEntity.ok(attemptService.getFeedback(sessionId, attemptId));
    }

    /**
     * GET /api/v1/sessions/{sessionId}/attempts
     * Full attempt history — used by the session review/summary screen.
     */
    @GetMapping
    public ResponseEntity<List<AttemptResponse>> listAttempts(
            @PathVariable Long sessionId) {
        return ResponseEntity.ok(attemptService.listAttempts(sessionId));
    }
}