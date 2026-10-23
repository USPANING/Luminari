package pl.luminari.backendjava.subjects;

import jakarta.persistence.*;

@Entity
@Table(name = "przedmioty")
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nazwa")
    private String name;

    protected Subject() {}

    public String getName() {
        return name;
    }

    public Long getId() {
        return id;
    }
}
