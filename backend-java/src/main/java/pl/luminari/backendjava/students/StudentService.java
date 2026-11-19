package pl.luminari.backendjava.students;

import org.springframework.stereotype.Service;

@Service
public class StudentService {
    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public StudentResponse create(CreateStudentRequest request) {
    Student student = new Student(request.nickname(), request.schoolClass(), request.nativeLanguage());
    Student saved = studentRepository.save(student);
    return new StudentResponse(saved.getId(), saved.getNickname(), saved.getSchoolClass(), saved.getNativeLanguage());
    }
}
