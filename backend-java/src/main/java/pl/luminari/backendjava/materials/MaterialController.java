package pl.luminari.backendjava.materials;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/materials")
public class MaterialController {
    private MaterialImportService materialImportService;

    public  MaterialController(MaterialImportService materialImportService) {
        this.materialImportService = materialImportService;
    }
    @PostMapping("/import")
    public String importPdf(@RequestParam String fileName, @RequestParam Long subtopicId) throws IOException {
        int count = materialImportService.importPdf(fileName, subtopicId);
        return "Saved " + count + " chunks";
    }
}
