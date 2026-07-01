package com.sparkfest.backend.dtos.exercise;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionExerciseResponse {

    private Short sequenceOrder;
    private ExerciseResponse exercise;
}