package com.sparkfest.backend.controllers;

import com.sparkfest.backend.dtos.dictionary.DictionaryResponse;
import com.sparkfest.backend.services.DictionaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/children/{childId}/dictionary")
@RequiredArgsConstructor
public class DictionaryController {

    private final DictionaryService dictionaryService;

    // GET /api/v1/children/{childId}/dictionary
    // Returns the child's personal word list curated from their session history
    // Sorted: HIGH priority first → MEDIUM → LOW → alphabetical within group
    @GetMapping
    public ResponseEntity<DictionaryResponse> getDictionary(@PathVariable Long childId) {
        return ResponseEntity.ok(dictionaryService.getDictionary(childId));
    }
}