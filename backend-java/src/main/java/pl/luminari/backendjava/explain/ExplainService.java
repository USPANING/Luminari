package pl.luminari.backendjava.explain;

import org.springframework.stereotype.Service;
import pl.luminari.backendjava.questions.Question;
import pl.luminari.backendjava.questions.QuestionRepository;
import pl.luminari.backendjava.students.Student;
import pl.luminari.backendjava.students.StudentRepository;

@Service
public class ExplainService {
    private final StudentRepository studentRepository;
    private final QuestionRepository questionRepository;
    private final OpenAiClient openAiClient;

    public ExplainService(StudentRepository studentRepository, QuestionRepository questionRepository, OpenAiClient openAiClient) {
        this.studentRepository = studentRepository;
        this.questionRepository = questionRepository;
        this.openAiClient = openAiClient;
    }

    public ExplainResponse explain(ExplainRequest request) {
        if (request.mistakes().isEmpty()) {
            return new ExplainResponse("Brak błędów do wyjaśnienia, wszystkie odpowiedzi poprawne!");
        }
        Student student = studentRepository.findById(request.studentId()).orElseThrow();
        String language = student.getNativeLanguage();
        if (language == null) {
            language = "polski";
        }

        StringBuilder details = new StringBuilder();
        for (MistakeDto mistake : request.mistakes()) {
            Question question = questionRepository.findById(mistake.questionId()).orElseThrow();
            details.append("Pytanie: " + question.getContent() + "\n");
            details.append("Warianty: " + question.getAnswers() + "\n");
            details.append("Odpowiedź ucznia: " + mistake.answer() + "\n");
            details.append("Poprawna odpowiedź: " + question.getCorrectAnswer() + "\n\n");
        }
        String prompt = """
                Rola: Jesteś cierpliwym korepetytorem dla ucznia szkoły średniej w Polsce.
                
                Kontekst: Uczeń uczy się w polskiej szkole. Jego język ojczysty to: %1$s.
                Poniżej lista pytań, w których uczeń popełnił błąd w tym teście (z wariantami odpowiedzi):
                
                %2$s
                Zadanie: Dla KAŻDEGO pytania wygeneruj blok DOKŁADNIE w tym formacie:
                
                Pytanie: [dokładna treść pytania po polsku]
                Twoja odpowiedź: [litera i treść odpowiedzi ucznia]
                Poprawna odpowiedź: [litera i treść poprawnej odpowiedzi]
                Wyjaśnienie: [2-3 proste zdania w języku %1$s: dlaczego poprawna odpowiedź jest poprawna i czym różni się od odpowiedzi ucznia]
                
                Zasady dla pola "Wyjaśnienie":
                1. Całe wyjaśnienie pisz WYŁĄCZNIE w języku %1$s. Po polsku piszesz TYLKO nazwy terminów w nawiasach.
                2. Każdy termin przedmiotowy pisz w języku %1$s, a zaraz po nim w nawiasie jego polską nazwę, np. "трикутник (trójkąt)".
                3. Nie używaj słów angielskich.
                4. Bez żargonu i bez oceniania ucznia.
                
                Przykład jednego bloku (dla języka ukraińskiego, z innego przedmiotu — nie kopiuj go):
                Pytanie: Gdzie zachodzi fotosynteza?
                Twoja odpowiedź: A. w mitochondriach
                Poprawna odpowiedź: C. w chloroplastach
                Wyjaśnienie: Фотосинтез (fotosynteza) відбувається в хлоропластах (chloroplasty), бо саме там є хлорофіл (chlorofil), який поглинає світло. Мітохондрії (mitochondria) відповідають за клітинне дихання, а не за фотосинтез.
                
                Oddziel bloki jedną pustą linią. Bez wstępu i bez podsumowania.
                Format: zwykły tekst, BEZ Markdown (bez #, bez **, bez numerowania).
                Nie pisz nic poza tematem pytań.
                """.formatted(language, details);

        String text = openAiClient.ask(prompt);
        return new ExplainResponse(text);
    }
}
