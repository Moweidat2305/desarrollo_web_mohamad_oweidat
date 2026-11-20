package cl.uchile.tarea4;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AvistamientoController {

    private static final DateTimeFormatter FORMATO_DIA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final AvistamientoRepository avistamientoRepository;
    private final NotaRepository notaRepository;

    public AvistamientoController(AvistamientoRepository avistamientoRepository, NotaRepository notaRepository) {
        this.avistamientoRepository = avistamientoRepository;
        this.notaRepository = notaRepository;
    }

    @GetMapping("/api/buscar")
    public List<Resultado> buscar(@RequestParam(defaultValue = "") String texto) {
        List<Resultado> resultados = new ArrayList<>();
        texto = texto.trim();
        if (texto.isEmpty()) {
            return resultados;
        }

        for (Avistamiento a : avistamientoRepository.buscar(texto)) {
            resultados.add(new Resultado(
                    a.getId(),
                    a.getVoluntario().getNombre(),
                    a.getFechaHora().format(FORMATO_DIA),
                    a.getAve().getNombre(),
                    a.getComuna().getNombre(),
                    notaRepository.promedio(a.getId())));
        }
        return resultados;
    }

    @PostMapping("/api/avistamientos/{id}/notas")
    public ResponseEntity<?> agregarNota(@PathVariable Integer id, @RequestParam(defaultValue = "") String nota) {
        if (!avistamientoRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "El avistamiento no existe."));
        }

        // solo enteros entre 1 y 7
        int valor;
        try {
            valor = Integer.parseInt(nota.trim());
        } catch (NumberFormatException e) {
            valor = 0;
        }
        if (valor < 1 || valor > 7) {
            return ResponseEntity.badRequest().body(Map.of("error", "La nota debe ser un número entero entre 1 y 7."));
        }

        notaRepository.save(new Nota(id, valor));
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("nota", notaRepository.promedio(id)));
    }
}
