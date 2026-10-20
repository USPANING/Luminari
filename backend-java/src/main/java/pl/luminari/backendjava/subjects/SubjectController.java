package pl.luminari.backendjava.subjects;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/przedmioty")

public class SubjectController {

    private final SubjectRepository subjectRepository;


    public SubjectController(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;

    }

    @GetMapping
    public List<Subject> getAll() {
        return  subjectRepository.findAll();
    }
}
