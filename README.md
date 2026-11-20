# Tarea 4 - Avistamientos de aves - Mohamad Oweidat

En esta tarea agrego un buscador de avistamientos y la opcion de evaluarlos con una nota. Esta hecha con Spring Boot y esta en la carpeta `tarea4/`. La app Flask de las tareas anteriores sigue en la raiz del repositorio, solo le agregue el enlace al buscador en el menu.

## Como lanzarlo

Se usa la misma base `tarea2` de las tareas anteriores. Solo hay que agregar la tabla `nota`:

    mysql -u root --default-character-set=utf8mb4 < sql/tabla-nota.sql

Si la base no existe todavia, primero hay que correr los scripts de la tarea 3 (`tarea2.sql`, `region-comuna.sql`, `aves.sql`, `ajustes.sql` y `tabla-comentario.sql`).

Hay que tener las dos apps corriendo, cada una en su terminal. Primero la app Flask, en la raiz del repositorio:

    python app.py

Despues el buscador con Spring Boot (Java 17 o mas):

    cd tarea4
    ./mvnw spring-boot:run

En Windows se usa `mvnw.cmd spring-boot:run`.

Con las dos corriendo, se abre el sitio de siempre en http://127.0.0.1:5001 y se entra al buscador con el enlace "Buscador" del menu. Ahi se escribe el nombre de un ave, un voluntario o una comuna y los resultados aparecen solos.

## Como funciona

- El buscador es otra app y corre en el puerto 8080, pero usa la misma base que Flask. Las dos tienen el mismo menu, asi que se puede pasar de una a la otra.
- Use Spring Boot 4.1 con Spring Web, Spring Data JPA y el driver de MySQL. Las tablas ya existen por eso puse `spring.jpa.hibernate.ddl-auto=none`: Spring no crea ni cambia nada en la base.
- La busqueda se hace cada vez que cambia el texto. No distingue mayusculas ni tildes, porque asi compara MySQL en esta base. El resaltado hace lo mismo, asi "galapagos" resalta "Galápagos".
- La nota que se muestra es el promedio de todas las notas del avistamiento. Si todavia no tiene, se muestra "-".
- Al hacer clic en "Evaluar" aparece una lista con las notas de 1 a 7. Al elegir una, se guarda sin recargar la pagina y se actualiza el promedio de esa fila.
- El servidor solo acepta numeros enteros de 1 a 7 y revisa que el avistamiento exista, aunque la lista ya limite las opciones.
