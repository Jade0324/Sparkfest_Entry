package com.sparkfest.backend.dtos.session;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class StartSessionRequest {

    @NotNull(message = "childId is required")
    private Long childId;

    // Optional — if omitted, backend picks exercises automatically
    private List<Long> exerciseIds;
}