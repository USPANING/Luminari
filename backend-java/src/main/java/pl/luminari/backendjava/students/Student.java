package pl.luminari.backendjava.students;
import jakarta.persistence.*;

@Entity
@Table(name = "uczniowie")

public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pseudonim")
    private String nickname;

    @Column(name = "klasa")
    private String schoolClass;

    @Column(name = "jezyk_ojczysty")
    private String nativeLanguage;

    protected Student() {}

    public Student(String nickname, String schoolClass, String nativeLanguage) {
        this.nickname = nickname;
        this.schoolClass = schoolClass;
        this.nativeLanguage = nativeLanguage;
    }

    public Long getId() {return id;}

    public String getNickname() {return nickname;}

    public String getSchoolClass() {return schoolClass;}

    public String getNativeLanguage() {return nativeLanguage;}
}
