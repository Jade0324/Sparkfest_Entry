package com.sparkfest.backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public String evaluateSpeech(String base64Audio, String targetWord) {
        try {
            // 1. Construct the AI Prompt
            String promptText = "You are an expert, encouraging speech therapist for children. " +
                    "Listen to the attached audio. Did the child clearly pronounce the word '" + targetWord + "'? " +
                    "Return ONLY a JSON object with two fields: 'accuracyScore' (a number from 1 to 100) " +
                    "and 'aiFeedback' (a short, gentle, and encouraging message for the child).";

            // 2. Build the JSON Payload for Gemini 2.5 Flash
            String requestBody = """
                    {
                      "contents": [
                        {
                          "parts": [
                            { "text": "%s" },
                            {
                              "inline_data": {
                                "mime_type": "audio/webm",
                                "data": "%s"
                              }
                            }
                          ]
                        }
                      ]
                    }
                    """.formatted(promptText.replace("\"", "\\\""), base64Audio);

            // 3. Send the Request to Google
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl + "?key=" + apiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            return response.body();

        } catch (Exception e) {
            e.printStackTrace();
            return "{\"accuracyScore\": 0, \"aiFeedback\": \"Oops! Our parrot had trouble listening. Let's try again!\"}";
        }
    }
}