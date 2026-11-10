package pl.luminari.backendjava.testresult;

import java.util.List;

public record TestResultResponse(int correct, int total, double percent, List<AnswerDto> wrongAnswers) {
}
