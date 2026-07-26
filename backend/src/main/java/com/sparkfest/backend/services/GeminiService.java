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

  /**
   * Synthesizes text to audio using Gemini 2.5 Flash TTS.
   * Returns raw WAV bytes — same key as evaluateSpeech, different model endpoint.
   * Voice "Aoede" = warm, breezy female — best fit for LORO's encouraging tutor
   * tone.
   */
  public byte[] synthesizeSpeech(String text) throws Exception {
    String ttsUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent";

    String safeText = text
        .replace("\\", "\\\\")
        .replace("\"", "\\\"")
        .replace("\n", " ")
        .trim();

    String requestBody = """
        {
          "contents": [{
            "parts": [{"text": "%s"}]
          }],
          "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {
              "voiceConfig": {
                "prebuiltVoiceConfig": {
                  "voiceName": "Aoede"
                }
              }
            }
          }
        }
        """.formatted(safeText);

    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(ttsUrl + "?key=" + apiKey))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(requestBody))
        .build();

    HttpResponse<String> response = httpClient.send(
        request, HttpResponse.BodyHandlers.ofString());

    if (response.statusCode() != 200) {
      throw new RuntimeException(
          "Gemini TTS error " + response.statusCode() + ": " + response.body());
    }

    // Use regex-free extraction — strip whitespace before searching
    String body = response.body().replaceAll("\\s+", " ");
    String dataMarker = "\"data\": \"";
    int dataStart = body.indexOf(dataMarker);
    if (dataStart < 0) {
      // Try without space after colon
      dataMarker = "\"data\":\"";
      dataStart = body.indexOf(dataMarker);
    }
    if (dataStart < 0) {
      throw new RuntimeException(
          "Gemini TTS: no audio data in response. Body: " +
              body.substring(0, Math.min(300, body.length())));
    }
    dataStart += dataMarker.length();
    int dataEnd = body.indexOf("\"", dataStart);
    if (dataEnd < 0) {
      throw new RuntimeException("Gemini TTS: could not find end of data field.");
    }

    byte[] pcmBytes = java.util.Base64.getDecoder()
        .decode(body.substring(dataStart, dataEnd));

    // Wrap raw PCM (16-bit signed, little-endian, 24000Hz, mono) in a WAV header
    // so the browser Audio element can decode it without extra libraries.
    return wrapPcmInWav(pcmBytes, 24000, 1, 16);
  }

  /**
   * Builds a minimal valid WAV file from raw 16-bit PCM bytes.
   * sampleRate: 24000 (Gemini's output rate)
   * channels: 1 (mono)
   * bitDepth: 16
   */
  private byte[] wrapPcmInWav(byte[] pcm, int sampleRate, int channels, int bitDepth) {
    int byteRate = sampleRate * channels * bitDepth / 8;
    int blockAlign = channels * bitDepth / 8;
    int dataSize = pcm.length;
    int totalSize = 44 + dataSize;

    java.nio.ByteBuffer buf = java.nio.ByteBuffer
        .allocate(totalSize)
        .order(java.nio.ByteOrder.LITTLE_ENDIAN);

    // RIFF header
    buf.put(new byte[] { 'R', 'I', 'F', 'F' });
    buf.putInt(totalSize - 8);
    buf.put(new byte[] { 'W', 'A', 'V', 'E' });

    // fmt chunk
    buf.put(new byte[] { 'f', 'm', 't', ' ' });
    buf.putInt(16); // chunk size
    buf.putShort((short) 1); // PCM format
    buf.putShort((short) channels);
    buf.putInt(sampleRate);
    buf.putInt(byteRate);
    buf.putShort((short) blockAlign);
    buf.putShort((short) bitDepth);

    // data chunk
    buf.put(new byte[] { 'd', 'a', 't', 'a' });
    buf.putInt(dataSize);
    buf.put(pcm);

    return buf.array();
  }
}