package pl.luminari.backendjava.testresult;

import org.junit.jupiter.api.Test;
import pl.luminari.backendjava.questions.Question;
import pl.luminari.backendjava.questions.QuestionRepository;
import pl.luminari.backendjava.results.AnswerRecordRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class TestServiceTest {
    QuestionRepository questionRepository = mock(QuestionRepository.class);
    AnswerRecordRepository answerRecordRepository = mock(AnswerRecordRepository.class);

    TestService testService = new TestService( questionRepository, answerRecordRepository);

    @Test
    void oneCorrectAndOneWrongAnswer() {
        Question question1 = mock(Question.class);
        when(question1.getCorrectAnswer()).thenReturn("B");
        Question question2 = mock(Question.class);
        when(question2.getCorrectAnswer()).thenReturn("B");
        when(questionRepository.findById(1L)).thenReturn(Optional.of(question1));
        when(questionRepository.findById(2L)).thenReturn(Optional.of(question2));
        TestResultRequest request = new TestResultRequest(
                1L,
                List.of(
                        new AnswerDto(1L, "B"),
                        new AnswerDto(2L, "A")
                )

        );

        TestResultResponse result = testService.checkTest(request);

        assertEquals(1, result.correct());
        assertEquals(2, result.total());
        assertEquals(50.0, result.percent());
        assertEquals(1, result.wrongAnswers().size());
    }
}
