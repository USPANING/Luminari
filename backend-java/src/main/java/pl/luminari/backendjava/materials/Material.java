package pl.luminari.backendjava.materials;

import jakarta.persistence.*;

@Entity
@Table(name = "materialy")
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "podtemat_id")
    private Long subtopicId;

    @Column(name = "tresc")
    private String content;

    @Column(name = "zrodlo")
    private String source;

    @Column(name = "status")
    private String status;

    protected Material() {
    }

    public Material(Long subtopicId, String content, String source, String status) {
        this.subtopicId = subtopicId;
        this.content = content;
        this.source = source;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Long getSubtopicId() {
        return subtopicId;
    }

    public String getContent() {
        return content;
    }

    public String getSource() {
        return source;
    }

    public String getStatus() {
        return status;
    }
}
