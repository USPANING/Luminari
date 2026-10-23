package pl.luminari.backendjava.topics;

import jakarta.persistence.*;

@Entity
@Table(name = "tematy")

public class Topic{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "przedmiot_id")
    private Long subjectId;

    @Column(name = "nazwa")
    private String name;

    @Column(name = "kolejnosc")
    private Integer position;

    protected Topic() { }

    public Long getId() {
        return id;
    }

    public  Long getSubjectId() {return  subjectId;}

    public String getName() {return name;}

    public Integer getPosition() {return position;}
}