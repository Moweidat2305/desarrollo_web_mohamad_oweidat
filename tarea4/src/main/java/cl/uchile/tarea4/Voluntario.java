package cl.uchile.tarea4;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// solo necesito el nombre del voluntario
@Entity
@Table(name = "voluntario")
public class Voluntario {

    @Id
    private Integer id;

    private String nombre;

    public String getNombre() {
        return nombre;
    }
}
