package pl.luminari.backendjava.results;


import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "wyniki_odpowiedzi")
public class AnswerRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "uczen_id")
    private Long studentId;

    @Column(name = "pytanie_id")
    private Long questionId;

    @Column(name = "odpowiedz")
    private String answer;

    @Column(name = "czy_poprawna")
    private Boolean correct;

    @Column(name = "data")
    private Instant createdAt;

    protected AnswerRecord() {
    }

    public Long getId() {
        return id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public String getAnswer() {
        return answer;
    }

    public Boolean getCorrect() {
        return correct;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public AnswerRecord(Long studentId, Long questionId, String answer, Boolean correct) {
        this.studentId = studentId;
        this.questionId = questionId;
        this.answer = answer;
        this.correct = correct;
        this.createdAt = Instant.now();
    }
}
