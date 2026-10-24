package pl.luminari.backendjava.questions;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findBySubtopicIdOrderByIdAsc(Long subtopicId);
}
