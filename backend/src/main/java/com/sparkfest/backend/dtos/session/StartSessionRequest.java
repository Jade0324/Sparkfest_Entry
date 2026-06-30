package com.sparkfest.backend.dtos.session;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class StartSessionRequest {

    @NotNull
    private Long childId;

    @NotEmpty
    private List<Long> exerciseIds; // ordered; maps to session_exercises.sequence_order
}