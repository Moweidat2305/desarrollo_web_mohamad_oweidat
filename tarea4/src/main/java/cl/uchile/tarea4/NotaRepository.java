package cl.uchile.tarea4;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotaRepository extends JpaRepository<Nota, Integer> {

    // null si el avistamiento no tiene notas
    @Query("SELECT AVG(n.nota) FROM Nota n WHERE n.avistamientoId = :id")
    Double promedio(@Param("id") Integer id);
}
