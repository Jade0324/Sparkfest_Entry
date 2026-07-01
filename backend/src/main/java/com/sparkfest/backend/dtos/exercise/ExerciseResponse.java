package com.sparkfest.backend.dtos.exercise;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseResponse {
    private Long id;
    private String targetWord;
    private String nativeWord;
    private String phonemeFocus;
    private Short difficulty;
    private String mediaUrl;
    private String instructions;
}