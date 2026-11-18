package pl.luminari.backendjava.explain;

import java.util.List;

public record ExplainResponse(List<ExplanationItem> items) {
}
