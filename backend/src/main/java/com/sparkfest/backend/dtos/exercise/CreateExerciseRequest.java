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

    // Category, e.g. "Animals", "Fruits", "Things" — optional
    private String category;

    @NotNull
    @Min(1)
    @Max(5)
    private Short difficulty;

    private String mediaUrl;

    private String instructions;

    // --- Progressive Overload Fields ---
    private String level1Prompt;
    private String level1Text;
    private String level1ImageUrl;

    private String level2Prompt;
    private String level2Text;
    private String level2ImageUrl;

    private String level3Prompt;
    private String level3Text;
    private String level3ImageUrl;
}