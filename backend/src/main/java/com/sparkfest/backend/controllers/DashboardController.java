package com.sparkfest.backend.controllers;

import com.sparkfest.backend.dtos.dashboard.DashboardResponse;
import com.sparkfest.backend.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "https://sparkfest-entry-2.onrender.com")
@RestController
@RequestMapping("/api/v1/children/{childId}/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    // GET /api/v1/children/{childId}/dashboard
    // Returns everything the Home screen needs in one call
    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(@PathVariable Long childId) {
        return ResponseEntity.ok(dashboardService.getDashboard(childId));
    }
}