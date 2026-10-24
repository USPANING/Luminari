package pl.luminari.backendjava.subtopics;


import jakarta.persistence.*;

@Entity
@Table(name = "podtematy")
public class Subtopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "temat_id")
    private Long topicId;

    @Column(name = "nazwa")
    private String name;

    @Column(name = "wymagania")
    private String requirements;

    protected Subtopic() {}

    public Long getId() {
        return id;
    }

    public Long getTopicId() {return topicId;}

    public String getName() {return name;}

    public String getRequirements() {return requirements;}

}
