package pl.luminari.backendjava.explain;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai")
public class ExplainController {
    private final ExplainService explainService;

    public ExplainController (ExplainService explainService) {
        this.explainService = explainService;
    }

    @PostMapping("/explain")
    public ExplainResponse checkTest(@RequestBody ExplainRequest request) {
        return explainService.explain(request);
    }
}