package pl.luminari.backendjava.materials;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class MaterialImportService {

    private final MaterialRepository materialRepository;

    public MaterialImportService(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }

    @Transactional
    public int importPdf(String fileName, Long subtopicId) throws IOException {
        InputStream input = getClass().getClassLoader()
                .getResourceAsStream("materials/" + fileName);
        if (input == null) {
            throw new IOException("PDF not found: " + fileName);
        }

        String text;
        try (PDDocument document = Loader.loadPDF(input.readAllBytes())) {
            text = new PDFTextStripper().getText(document);
        }

        String cleaned = cleanText(text);
        List<String> chunks = splitIntoChunks(cleaned, 150);

        materialRepository.deleteBySubtopicId(subtopicId);

        for (String chunk : chunks) {
            Material material = new Material(subtopicId, chunk, fileName, "szkic");
            materialRepository.save(material);
        }

        return chunks.size();
    }

    private String cleanText(String text) {
        String[] parts = text.split("\n");
        StringBuilder cleaned = new StringBuilder();
        for (String part : parts) {
            part = part.strip();
            part = part.replace("\u0000", "");
            if (part.length() < 4 || part.startsWith("Źródło:") || part.contains("/preview/") || part.contains("atrapa_animacja") || part.contains("Zasób interaktywny")) {
                continue;
            } else {
                cleaned.append(part);
                cleaned.append(" ");
            }
        }
        return cleaned.toString();
    }

    private List<String> splitIntoChunks(String text, int wordsPerChunk) {
        String[] words = text.split(" ");
        ArrayList<String> parts = new ArrayList<>();
        for (int i = 0; i < words.length; i += wordsPerChunk) {
            StringBuilder chunk = new StringBuilder();
            int end = Math.min(i + wordsPerChunk, words.length);
            for (int j = i; j < end; j++) {
                chunk.append(words[j]);
                chunk.append(" ");
            }
            parts.add(chunk.toString().strip());
        }
        return parts;
    }
}