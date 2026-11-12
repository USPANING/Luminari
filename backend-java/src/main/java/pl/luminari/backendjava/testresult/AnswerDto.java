package pl.luminari.backendjava.testresult;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AnswerDto(
        @NotNull Long questionId,
        @NotBlank String answer
) {
}
