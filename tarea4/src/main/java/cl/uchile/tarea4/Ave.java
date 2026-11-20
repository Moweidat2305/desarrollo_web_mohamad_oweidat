package cl.uchile.tarea4;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ave")
public class Ave {

    @Id
    private Integer id;

    private String nombre;

    public String getNombre() {
        return nombre;
    }
}
