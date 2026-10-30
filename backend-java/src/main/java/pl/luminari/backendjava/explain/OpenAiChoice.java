package pl.luminari.backendjava.explain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OpenAiChoice(OpenAiMessage message) {
}
