# Tarea 3 - Avistamientos de aves - Mohamad Oweidat

Esta tarea es para agregar las estadisticas con los datos de la base y los comentarios en el detalle de cada avistamiento.

## Como lanzarlo

Crear la base de datos, en este orden:

```
mysql -u root --default-character-set=utf8mb4 < sql/tarea2.sql
mysql -u root --default-character-set=utf8mb4 tarea2 < sql/region-comuna.sql
mysql -u root --default-character-set=utf8mb4 tarea2 < sql/aves.sql
mysql -u root --default-character-set=utf8mb4 < sql/ajustes.sql
mysql -u root --default-character-set=utf8mb4 < sql/tabla-comentario.sql
```

Instalar y lanzar:

```
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Despues abrir http://127.0.0.1:5001 (uso el puerto 5001 porque en mi Mac el 5000 lo usa AirPlay).

Si root tiene contraseña agregar `-p` a los comandos `mysql`. En Windows, los comandos `mysql` con `<` funcionan en cmd, el entorno se activa con `.venv\Scripts\activate` y se usa `python` en vez de `python3`.

## Estadisticas

Para los graficos use Chart.js 4.4.1 (https://www.chartjs.org/) que tiene licencia MIT. Lo cargo desde el CDN de jsDelivr. Ya lo habia usado en la tarea 1.

La pagina de estadisticas llega sin datos. El JavaScript pide los datos con fetch a tres URL de Flask que responden en JSON, y despues dibuja los graficos:

- `/estadisticas/avistamientos-por-dia` para el grafico de lineas
- `/estadisticas/avistamientos-por-ave` para el grafico de torta
- `/estadisticas/voluntarios-por-comuna` para el grafico de barras

El grafico de torta muestra los avistamientos por ave y no por tipo, porque la tabla `ave` no tiene tipo (igual que en la tarea 2). Los dias del grafico de lineas son los dias en que se vio el ave.

## Comentarios

En el detalle de un avistamiento se ven sus comentarios y hay un formulario para agregar uno. Todo funciona con fetch, sin recargar la pagina. La URL es `/detalle/<id>/comentarios`: con GET devuelve la lista y con POST guarda un comentario nuevo.

Los datos se validan en JavaScript y otra vez en el servidor: el nombre debe tener entre 3 y 50 caracteres y el comentario al menos 5. Tambien puse un maximo de 300 caracteres porque la columna `texto` es `VARCHAR(300)`. Si hay errores, se muestran debajo de cada campo y el formulario no se borra.
