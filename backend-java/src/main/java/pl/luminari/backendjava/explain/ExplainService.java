package pl.luminari.backendjava.explain;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import pl.luminari.backendjava.error.ResourceNotFoundException;
import pl.luminari.backendjava.materials.Material;
import pl.luminari.backendjava.materials.MaterialRepository;
import pl.luminari.backendjava.questions.Question;
import pl.luminari.backendjava.questions.QuestionRepository;
import pl.luminari.backendjava.students.Student;
import pl.luminari.backendjava.students.StudentRepository;
import tools.jackson.databind.json.JsonMapper;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ExplainService {
    private final StudentRepository studentRepository;
    private final QuestionRepository questionRepository;
    private final OpenAiClient openAiClient;
    private final MaterialRepository materialRepository;
    private final boolean ragEnabled;
    private final JsonMapper jsonMapper;

    public ExplainService(StudentRepository studentRepository, QuestionRepository questionRepository,
                          OpenAiClient openAiClient, MaterialRepository materialRepository,
                          @Value("${luminari.rag.enabled}") boolean ragEnabled, JsonMapper jsonMapper ) {
        this.studentRepository = studentRepository;
        this.questionRepository = questionRepository;
        this.openAiClient = openAiClient;
        this.materialRepository = materialRepository;
        this.ragEnabled = ragEnabled;
        this.jsonMapper = jsonMapper;
    }

    public ExplainResponse explain(ExplainRequest request) {
        if (request.mistakes().isEmpty()) {
            return new ExplainResponse(List.of());
        }
        Student student = studentRepository.findById(request.studentId()).orElseThrow(() -> new ResourceNotFoundException("Student not found: " + request.studentId()));
        String language = student.getNativeLanguage();
        if (language == null) {
            language = "polski";
        }

        StringBuilder details = new StringBuilder();
        Set<Long> subtopicIds = new HashSet<>();
        for (MistakeDto mistake : request.mistakes()) {
            Question question = questionRepository.findById(mistake.questionId()).orElseThrow(() -> new ResourceNotFoundException("Question not found: " + mistake.questionId()));
            subtopicIds.add(question.getSubtopicId());
            details.append("Pytanie: " + question.getContent() + "\n");
            details.append("Warianty: " + question.getAnswers() + "\n");
            details.append("Odpowiedź ucznia: " + mistake.answer() + "\n");
            details.append("Poprawna odpowiedź: " + question.getCorrectAnswer() + "\n\n");
        }
        StringBuilder materials = new StringBuilder();
        if (ragEnabled) {
            for(Long subtopicId : subtopicIds) {
                List<Material> chunks = materialRepository.findBySubtopicIdOrderByIdAsc(subtopicId);
                for (Material chunk : chunks) {
                    materials.append(chunk.getContent());
                    materials.append("\n\n");
                }
            }
        }
        String materialsText = materials.toString();
        if (materialsText.isEmpty()) {
            materialsText = "Brak materiałów.";
        }
        String prompt = """
                Rola: Jesteś cierpliwym korepetytorem dla ucznia szkoły średniej w Polsce.
                
                Kontekst: Uczeń uczy się w polskiej szkole. Jego język ojczysty to: %1$s.
                Poniżej lista pytań, w których uczeń popełnił błąd w tym teście (z wariantami odpowiedzi):
                
                %2$s
                Materiały z podręcznika do tych tematów (użyj ich jako głównego źródła wyjaśnienia; jeśli nie pasują do pytania, zignoruj je i nie wymyślaj faktów):
                
                %3$s
                Zadanie: Dla KAŻDEGO pytania przygotuj jeden obiekt. Odpowiedz WYŁĄCZNIE poprawnym JSON w tym kształcie:
                
                {"items": [{"question": "...", "studentAnswer": "...", "correctAnswer": "...", "explanation": "..."}]}
                
                Pola:
                - question: dokładna treść pytania po polsku
                - studentAnswer: litera i treść odpowiedzi ucznia
                - correctAnswer: litera i treść poprawnej odpowiedzi
                - explanation: 2-3 proste zdania w języku ucznia (%1$s): dlaczego poprawna odpowiedź jest poprawna i czym różni się od odpowiedzi ucznia
                
                Zasady dla pola "explanation":
                1. Całe wyjaśnienie pisz WYŁĄCZNIE w języku ucznia (%1$s). Po polsku piszesz TYLKO nazwy terminów w nawiasach.
                2. Każdy termin przedmiotowy pisz w języku ucznia (%1$s), a zaraz po nim w nawiasie jego polską nazwę, np. "трикутник (trójkąt)".
                3. Nie używaj słów angielskich.
                4. Bez żargonu i bez oceniania ucznia.
                
                Przykład jednego obiektu (dla języka ukraińskiego, z innego przedmiotu — nie kopiuj go):
                {"question": "Gdzie zachodzi fotosynteza?", "studentAnswer": "A. w mitochondriach", "correctAnswer": "C. w chloroplastach", "explanation": "Фотосинтез (fotosynteza) відбувається в хлоропластах (chloroplasty), бо саме там є хлорофіл (chlorofil), який поглинає світло. Мітохондрії (mitochondria) відповідають за клітинне дихання, а не за фотосинтез."}
                
                Bez Markdown, bez ```, bez żadnego tekstu przed JSON ani po nim.
                """.formatted(language, details, materialsText);

        String text = openAiClient.ask(prompt);
        return jsonMapper.readValue(text, ExplainResponse.class);
    }
}
