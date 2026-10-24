package pl.luminari.backendjava.learningpath;

import java.util.List;

public record QuestionDto(Long id, String content, List<String> answers) {
}
