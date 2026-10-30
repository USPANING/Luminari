package pl.luminari.backendjava.explain;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OpenAiResponse(List<OpenAiChoice> choices) {
}
