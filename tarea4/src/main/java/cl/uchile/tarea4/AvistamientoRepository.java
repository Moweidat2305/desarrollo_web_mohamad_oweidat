package cl.uchile.tarea4;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AvistamientoRepository extends JpaRepository<Avistamiento, Integer> {

    // busca el texto en el nombre del ave, del voluntario o de la comuna
    @Query("SELECT a FROM Avistamiento a "
            + "WHERE a.ave.nombre LIKE %:texto% "
            + "OR a.voluntario.nombre LIKE %:texto% "
            + "OR a.comuna.nombre LIKE %:texto% "
            + "ORDER BY a.fechaHora DESC")
    List<Avistamiento> buscar(@Param("texto") String texto);
}
