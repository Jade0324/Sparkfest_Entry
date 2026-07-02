package com.sparkfest.backend.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "https://sparkfest-entry-2.onrender.com")
@RequestMapping("/api/auth")
public class AuthController {

    /**
     * POST /api/auth/login
     * Hackathon demo mode — all logins succeed.
     * Child model has no credentials yet; auth is a placeholder.
     * Frontend Login.jsx only checks response.ok to navigate.
     */
    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<String> login(
            @RequestParam String username,
            @RequestParam String password) {

        if (username == null || username.isBlank()) {
            return ResponseEntity.badRequest().body("Username is required.");
        }
        return ResponseEntity.ok("Welcome, " + username + "!");
    }
}