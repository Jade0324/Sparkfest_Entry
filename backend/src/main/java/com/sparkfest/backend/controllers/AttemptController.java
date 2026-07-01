package com.sparkfest.backend.controllers;

import com.sparkfest.backend.dtos.attempt.AttemptResponse;
import com.sparkfest.backend.dtos.attempt.SubmitAttemptRequest;
import com.sparkfest.backend.services.AttemptService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sessions/{sessionId}/attempts")
@RequiredArgsConstructor
public class AttemptController {

    private final AttemptService attemptService;

    // POST /api/v1/sessions/{sessionId}/attempts
    // Body: { "exerciseId": 1, "transcript": "pish", "accuracyScore": 45.00 }
    @PostMapping
    public ResponseEntity<AttemptResponse> submitAttempt(
            @PathVariable Long sessionId,
            @Valid @RequestBody SubmitAttemptRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(attemptService.submitAttempt(sessionId, request));
    }
}