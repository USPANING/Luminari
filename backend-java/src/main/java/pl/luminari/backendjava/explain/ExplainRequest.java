package pl.luminari.backendjava.explain;

import java.util.List;

public record ExplainRequest(Long studentId, List<MistakeDto> mistakes) {
}
