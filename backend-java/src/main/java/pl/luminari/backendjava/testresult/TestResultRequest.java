package pl.luminari.backendjava.testresult;

import java.util.List;

public record TestResultRequest(Long studentId, List<AnswerDto> answers) {
}
