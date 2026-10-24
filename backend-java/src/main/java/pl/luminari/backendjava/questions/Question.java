package pl.luminari.backendjava.questions;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;


import java.util.List;

@Entity
@Table(name = "pytania")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "podtemat_id")
    private Long subtopicId;

    @Column(name = "tresc")
    private String content;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "odpowiedzi")
    private List<String> answers;

    @Column(name = "poprawna")
    private  String correctAnswer;

    protected Question() {}

    public Long getId() {return id;}

    public Long getSubtopicId() {return subtopicId;}

    public String getContent() { return content;}

    public List<String> getAnswers() {return answers;}

    public String getCorrectAnswer() {return correctAnswer;}
}
