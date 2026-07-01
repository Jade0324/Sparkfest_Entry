package com.sparkfest.backend.dtos.dictionary;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class DictionaryResponse {

    private Long childId;
    private int totalWords;
    private int masteredWords;
    private int highPriorityCount;
    private List<DictionaryEntryResponse> entries;
}