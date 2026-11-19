package pl.luminari.backendjava.students;

import jakarta.validation.constraints.NotBlank;

public record CreateStudentRequest(@NotBlank String nickname, String schoolClass, @NotBlank String nativeLanguage) {
}
