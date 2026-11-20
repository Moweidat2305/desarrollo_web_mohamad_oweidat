package cl.uchile.tarea4;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "avistamiento")
public class Avistamiento {

    @Id
    private Integer id;

    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora;

    @ManyToOne
    @JoinColumn(name = "ave_id")
    private Ave ave;

    @ManyToOne
    @JoinColumn(name = "voluntario_id")
    private Voluntario voluntario;

    @ManyToOne
    @JoinColumn(name = "comuna_id")
    private Comuna comuna;

    public Integer getId() {
        return id;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public Ave getAve() {
        return ave;
    }

    public Voluntario getVoluntario() {
        return voluntario;
    }

    public Comuna getComuna() {
        return comuna;
    }
}
