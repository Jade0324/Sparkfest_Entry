package com.sparkfest.backend.controllers;

import com.sparkfest.backend.services.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tts")
@RequiredArgsConstructor
public class TTSController {

    private final GeminiService geminiService;

    /**
     * POST /api/v1/tts/speak
     * Body: { "text": "Say this out loud", "speed": 0.85 }
     * Returns: audio/wav bytes
     * Speed is applied client-side via Audio.playbackRate in useLORO.js.
     */
    @PostMapping("/speak")
    public ResponseEntity<byte[]> speak(@RequestBody TTSSpeakRequest request) {
        if (request.text() == null || request.text().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            byte[] audio = geminiService.synthesizeSpeech(request.text());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, "audio/wav")
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
                    .body(audio);
        } catch (Exception e) {
            System.err.println("[TTS] Gemini TTS error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    public record TTSSpeakRequest(String text, Double speed) {
    }
}