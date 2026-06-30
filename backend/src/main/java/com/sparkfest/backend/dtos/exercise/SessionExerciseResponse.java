package com.sparkfest.backend.dtos.exercise;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SessionExerciseResponse {
    private Short sequenceOrder;
    private ExerciseResponse exercise;
}