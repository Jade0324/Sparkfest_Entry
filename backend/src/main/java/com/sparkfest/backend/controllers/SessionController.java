package com.sparkfest.backend.controllers;

import com.sparkfest.backend.dtos.session.*;
import com.sparkfest.backend.services.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    /** POST /api/v1/sessions — start a new session */
    @PostMapping
    public ResponseEntity<SessionDetailResponse> startSession(
            @Valid @RequestBody StartSessionRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(sessionService.startSession(request));
    }

    /** GET /api/v1/sessions/{sessionId} — fetch full session state */
    @GetMapping("/{sessionId}")
    public ResponseEntity<SessionDetailResponse> getSession(
            @PathVariable Long sessionId) {
        return ResponseEntity.ok(sessionService.getSession(sessionId));
    }

    /** PATCH /api/v1/sessions/{sessionId}/complete — finish session */
    @PatchMapping("/{sessionId}/complete")
    public ResponseEntity<SessionSummaryResponse> completeSession(
            @PathVariable Long sessionId) {
        return ResponseEntity.ok(sessionService.completeSession(sessionId));
    }
}