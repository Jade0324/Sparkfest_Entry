package com.sparkfest.backend.dtos.exercise;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateExerciseRequest {

    @NotBlank
    private String targetWord;

    private String nativeWord;

    private String phonemeFocus;

    @NotNull
    @Min(1)
    @Max(5)
    private Short difficulty;

    private String mediaUrl;

    private String instructions;
}