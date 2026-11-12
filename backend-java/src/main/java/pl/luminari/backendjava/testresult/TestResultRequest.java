package pl.luminari.backendjava.testresult;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record TestResultRequest(
        @NotNull Long studentId,
        @NotEmpty List<@Valid AnswerDto> answers
) {
}
