package pl.luminari.backendjava.students;

import jakarta.validation.constraints.NotBlank;

public record StudentResponse(Long id,  String nickname, String schoolClass,  String nativeLanguage) {
}
