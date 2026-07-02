package com.sparkfest.backend.dtos.exercise;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExerciseResponse {
    private Long id;
    private String targetWord;
    private String phonemeFocus;
    private Short difficulty;
    private String mediaUrl;
    private String instructions;
    private String category;

    // Level progression
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