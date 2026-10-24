package pl.luminari.backendjava.learningpath;

import java.util.List;

public record TopicDto(Long id, String name, Integer position, List<SubtopicDto> subtopics) {
}
