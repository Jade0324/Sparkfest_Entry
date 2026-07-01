package com.sparkfest.backend.services;

import com.sparkfest.backend.dtos.dictionary.DictionaryEntryResponse;
import com.sparkfest.backend.dtos.dictionary.DictionaryResponse;
import com.sparkfest.backend.models.Attempt;
import com.sparkfest.backend.repositories.AttemptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DictionaryService {

    private final AttemptRepository attemptRepository;

    @Transactional(readOnly = true)
    public DictionaryResponse getDictionary(Long childId) {
        List<Attempt> latestAttempts = attemptRepository
                .findLatestAttemptPerExerciseByChildId(childId);

        Map<Long, BigDecimal> bestAccuracyMap = attemptRepository
                .findBestAccuracyPerExerciseByChildId(childId)
                .stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> row[1] != null ? (BigDecimal) row[1] : BigDecimal.ZERO));

        Map<Long, Long> attemptCountMap = attemptRepository
                .findAttemptCountPerExerciseByChildId(childId)
                .stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> (Long) row[1]));

        List<DictionaryEntryResponse> entries = latestAttempts.stream()
                .map(a -> buildEntry(a, bestAccuracyMap, attemptCountMap))
                .sorted(Comparator
                        .comparingInt((DictionaryEntryResponse e) -> priorityRank(e.getPriority()))
                        .thenComparing(DictionaryEntryResponse::getTargetWord))
                .collect(Collectors.toList());

        int masteredCount = (int) entries.stream().filter(DictionaryEntryResponse::isMastered).count();
        int highPriorityCount = (int) entries.stream().filter(e -> "HIGH".equals(e.getPriority())).count();

        return DictionaryResponse.builder()
                .childId(childId)
                .totalWords(entries.size())
                .masteredWords(masteredCount)
                .highPriorityCount(highPriorityCount)
                .entries(entries)
                .build();
    }

    private DictionaryEntryResponse buildEntry(Attempt latest,
            Map<Long, BigDecimal> bestAccuracyMap,
            Map<Long, Long> attemptCountMap) {
        Long exId = latest.getExercise().getId();
        BigDecimal latestAccuracy = latest.getAccuracyScore();
        BigDecimal bestAccuracy = bestAccuracyMap.getOrDefault(exId, null);
        long count = attemptCountMap.getOrDefault(exId, 0L);

        return DictionaryEntryResponse.builder()
                .exerciseId(exId)
                .targetWord(latest.getExercise().getTargetWord())
                .nativeWord(latest.getExercise().getNativeWord())
                .phonemeFocus(latest.getExercise().getPhonemeFocus())
                .difficulty(latest.getExercise().getDifficulty())
                .mediaUrl(latest.getExercise().getMediaUrl())
                .attemptCount(count)
                .bestAccuracy(bestAccuracy)
                .latestAccuracy(latestAccuracy)
                .latestTranscript(latest.getTranscript())
                .mastered(Boolean.TRUE.equals(latest.getPassed()))
                .lastAttemptedAt(latest.getRecordedAt())
                .priority(computePriority(latestAccuracy))
                .build();
    }

    private String computePriority(BigDecimal accuracy) {
        if (accuracy == null)
            return "HIGH";
        if (accuracy.compareTo(new BigDecimal("60.00")) < 0)
            return "HIGH";
        if (accuracy.compareTo(new BigDecimal("80.00")) < 0)
            return "MEDIUM";
        return "LOW";
    }

    private int priorityRank(String priority) {
        return switch (priority) {
            case "HIGH" -> 0;
            case "MEDIUM" -> 1;
            default -> 2;
        };
    }
}