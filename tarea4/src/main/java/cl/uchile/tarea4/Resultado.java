package cl.uchile.tarea4;

// una fila del buscador, Spring la convierte a JSON
public record Resultado(Integer id, String voluntario, String dia, String ave, String comuna, Double nota) {
}
