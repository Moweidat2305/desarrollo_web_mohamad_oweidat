package cl.uchile.tarea4;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "nota")
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "avistamiento_id")
    private Integer avistamientoId;

    private Integer nota;

    // JPA necesita un constructor vacio
    protected Nota() {
    }

    public Nota(Integer avistamientoId, Integer nota) {
        this.avistamientoId = avistamientoId;
        this.nota = nota;
    }
}
