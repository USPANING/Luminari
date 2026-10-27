package pl.luminari.backendjava.testresult;

import org.springframework.stereotype.Service;
import pl.luminari.backendjava.questions.Question;
import pl.luminari.backendjava.questions.QuestionRepository;
import pl.luminari.backendjava.results.AnswerRecord;
import pl.luminari.backendjava.results.AnswerRecordRepository;


@Service
public class TestService {

    private final QuestionRepository questionRepository;
    private final AnswerRecordRepository answerRecordRepository;

    public TestService(QuestionRepository questionRepository, AnswerRecordRepository answerRecordRepository) {
        this.questionRepository = questionRepository;
        this.answerRecordRepository = answerRecordRepository;
    }

    public TestResultResponse checkTest(TestResultRequest request) {
        int countCorrect = 0;
        for (AnswerDto answerDto : request.answers()) {
            Question question = questionRepository.findById(answerDto.questionId()).orElseThrow();
            boolean isCorrect = answerDto.answer().equals(question.getCorrectAnswer());
            if (isCorrect) {
                countCorrect += 1;
            }
            AnswerRecord studentResult = new AnswerRecord(request.studentId(), answerDto.questionId(),
                    answerDto.answer(), isCorrect);
            answerRecordRepository.save(studentResult);
        }
        int totalQuestions = request.answers().size();
        double percent = 0;
        if (totalQuestions > 0) {
            double p = countCorrect * 100.0 / totalQuestions;
            percent = Math.round(p * 10) / 10.0;
        }

        return new TestResultResponse(countCorrect, totalQuestions, percent);
    }
}
