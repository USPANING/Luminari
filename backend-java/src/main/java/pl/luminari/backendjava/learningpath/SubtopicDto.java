package pl.luminari.backendjava.learningpath;

import java.util.List;

public record SubtopicDto(Long id, String name, String requirements, List<QuestionDto> questions) {
}
