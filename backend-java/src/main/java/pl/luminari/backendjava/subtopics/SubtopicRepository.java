package pl.luminari.backendjava.subtopics;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface SubtopicRepository extends JpaRepository<Subtopic, Long> {

    List<Subtopic> findByTopicIdOrderByIdAsc(Long topicId);
}
