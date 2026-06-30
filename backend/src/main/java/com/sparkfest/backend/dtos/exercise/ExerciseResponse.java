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
}