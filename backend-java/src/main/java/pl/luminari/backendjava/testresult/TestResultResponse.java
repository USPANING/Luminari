package pl.luminari.backendjava.testresult;

public record TestResultResponse(int correct, int total, double percent) {
}
