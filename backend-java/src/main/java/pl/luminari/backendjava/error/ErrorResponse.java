package pl.luminari.backendjava.error;

import java.util.List;

public record ErrorResponse (int status, String message, List<String> errors){
}
