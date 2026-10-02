# Tarea 2 - Registro de avistamientos de aves - Mohamad Oweidat

En esta tarea el prototipo de la tarea 1 pasa a funcionar de verdad, con Flask y una base de datos MySQL.
Se puede registrar un voluntario, informar un avistamiento con fotos o videos, y ver el listado de avistamientos con su detalle.
Las estadísticas quedan para la tarea 3.

La rama se llama `Tarea_2` y no "Tarea 2" porque git no acepta espacios en el nombre de una rama. Use el mismo formato que en la tarea 1.

## Como ejecutarlo

Primero crear la base de datos, en este orden:

```
mysql -u root --default-character-set=utf8mb4 < sql/tarea2.sql
mysql -u root --default-character-set=utf8mb4 tarea2 < sql/region-comuna.sql
mysql -u root --default-character-set=utf8mb4 tarea2 < sql/aves.sql
mysql -u root --default-character-set=utf8mb4 < sql/ajustes.sql
```

Despues instalar lo necesario y lanzar la aplicacion:

```
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

La pagina queda en http://127.0.0.1:5001. Use el puerto 5001 porque en mi Mac el 5000 lo ocupa AirPlay.

## Estructura

```
app.py            las paginas (rutas de Flask) y el guardado de archivos
db.py             la conexion a la base y todas las consultas SQL
validaciones.py   las validaciones del lado del servidor
templates/        una pagina HTML por funcionalidad
static/css, js    los estilos y scripts de la tarea 1, adaptados
static/uploads/   las fotos y videos subidos (se crea sola, no se sube a GitHub)
sql/              los archivos SQL del enunciado y mis ajustes
```

## Decisiones que conviene tener en cuenta

**Cambios al modelo de datos.** No toque `tarea2.sql`. Mis cambios estan todos en `sql/ajustes.sql`. Los hice para no perder campos ni validaciones del formulario de la tarea 1:
- En `voluntario` agregue la fecha de nacimiento y la calle, las dos opcionales. El telefono puede quedar vacio porque en la tarea 1 era opcional.
- El correo es unico. Es el dato que uso para saber a que voluntario pertenece un avistamiento, asi que no puede repetirse.
- En `avistamiento` agregue la cantidad de individuos y la comuna donde se vio el ave. El ave no siempre se ve en la comuna donde vive el voluntario.
- Saque el campo "tipo de ave" porque la tabla `ave` no tiene tipo. El nombre del ave ya no se escribe a mano, se elige de la lista de la tabla `ave`.
- La fecha y la hora del formulario se guardan juntas en `fecha_hora`.
- `fecha_registro` se llena con `NOW()` en el momento en que se inserta el voluntario.

**Validaciones.** El JavaScript de la tarea 1 sigue igual. El servidor vuelve a revisar todo con las mismas reglas, porque el JavaScript se puede desactivar o saltar. Ademas revisa cosas que el navegador no puede saber:
- al registrarse, que el correo no este ya registrado;
- al informar un avistamiento, que el correo sea de un voluntario registrado;
- que la comuna sea de la region elegida y que el ave exista en la base.

Si hay un error, el formulario vuelve a aparecer con los mensajes y con lo que el usuario ya habia escrito. Solo los archivos hay que adjuntarlos de nuevo, porque el navegador no deja que una pagina rellene ese campo.

**Archivos.** Se aceptan de 1 a 5 fotos o videos (jpg, jpeg, png, gif, webp, mp4, mov, webm) de maximo 50 MB cada uno. El servidor revisa la extension, el tipo, el tamaño y tambien el contenido real del archivo: con la libreria `filetype` lee los primeros bytes para saber si de verdad es una imagen o un video. Asi un archivo HTML renombrado como `foto.png` no pasa.
Cada archivo se guarda en `static/uploads/` con un nombre al azar. Asi dos fotos con el mismo nombre no se pisan, y nadie puede elegir donde se guarda el archivo.
En la tabla `registro` queda la ruta y el nombre original del archivo.
El avistamiento y sus archivos se guardan en una sola transaccion: o se guarda todo, o nada.
Si la base de datos falla despues de copiar los archivos, se borran del disco para no dejar archivos sueltos.
Si alguien envia mas de 260 MB en total, el formulario vuelve a aparecer con un mensaje claro en vez de una pagina de error.

**Seguridad.** Las consultas SQL siempre reciben los valores como parametros, nunca pegados al texto, asi se evita la inyeccion SQL.
Jinja escapa todo lo que muestra, entonces si alguien escribe un `<script>` en un campo, se ve como texto y no se ejecuta.
Los numeros que llegan por la URL (la pagina del listado, el id del detalle) se convierten a numero y se revisan. Si el avistamiento no existe, la pagina responde 404.

**Paginas.**
- La portada muestra los 2 ultimos avistamientos agregados a la base, es decir los de id mas alto.
- Despues de registrarse, se ofrece informar un avistamiento con el correo ya escrito, o volver al inicio.
- El listado muestra 5 avistamientos por pagina, del mas reciente al mas antiguo. Al hacer clic en una fila se abre el detalle con las fotos y videos.
- Las estadisticas siguen con los datos de ejemplo de la tarea 1 hasta la tarea 3.
