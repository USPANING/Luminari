package pl.luminari.backendjava.explain;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Component
public class OpenAiClient {

    private final RestClient restClient;
    public OpenAiClient(@Value("${openai.api-key}") String apiKey) {

        this.restClient = RestClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
    }

    public String ask(String prompt) {
        Map<String, Object> body = Map.of(
                "model", "gpt-4.1-mini",
                "temperature", 0.3,
                "messages", List.of(Map.of("role", "user", "content", prompt))

        );

        OpenAiResponse response = restClient.post()
                .uri("/chat/completions")
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(OpenAiResponse.class);

        return response.choices().get(0).message().content();
    }
}