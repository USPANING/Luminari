package pl.luminari.backendjava.learningpath;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.luminari.backendjava.questions.Question;
import pl.luminari.backendjava.questions.QuestionRepository;
import pl.luminari.backendjava.subtopics.Subtopic;
import pl.luminari.backendjava.subtopics.SubtopicRepository;
import pl.luminari.backendjava.topics.Topic;
import pl.luminari.backendjava.topics.TopicRepository;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/learning-path")
public class LearningPathController {
    private final TopicRepository topicRepository;
    private final SubtopicRepository subtopicRepository;
    private final QuestionRepository questionRepository;

    public LearningPathController(TopicRepository topicRepository, SubtopicRepository
            subtopicRepository, QuestionRepository questionRepository) {
        this.topicRepository = topicRepository;
        this.subtopicRepository = subtopicRepository;
        this.questionRepository = questionRepository;
    }

    @GetMapping("/{subjectId}")
    public List<TopicDto> getPath(@PathVariable Long subjectId) {
        List<Topic> topics = topicRepository.findBySubjectIdOrderByPositionAsc(subjectId);

        List<TopicDto> result = new ArrayList<>();

        for (Topic topic : topics) {
            List<Subtopic> subtopics = subtopicRepository.findByTopicIdOrderByIdAsc(subjectId);

            List<SubtopicDto> subresult = new ArrayList<>();

            for (Subtopic subtopic : subtopics) {
                List<Question> questions = questionRepository.findBySubtopicIdOrderByIdAsc(subtopic.getId());

                List<QuestionDto> questionResult = new ArrayList<>();

                for (Question question : questions) {
                    questionResult.add(new QuestionDto(question.getId(), question.getContent(), question.getAnswers()));
                }
                subresult.add(new SubtopicDto(subtopic.getId(), subtopic.getName(), subtopic.getRequirements(), questionResult));
            }
            result.add(new TopicDto(topic.getId(), topic.getName(), topic.getPosition(), subresult));
        }
        return result;
    }


}
