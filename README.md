# Tarea 2 - Avistamientos de aves - Mohamad Oweidat

En la tarea 1 hice las paginas en HTML, CSS y JavaScript, sin servidor.
En esta tarea las hice funcionar de verdad con Flask y una base de datos MySQL.

## Que se puede hacer

- **Portada**: un mensaje de bienvenida, el menu y los 2 ultimos avistamientos.
- **Registrar voluntario**: el formulario se guarda en la base. Despues se puede informar un avistamiento con el mismo correo o volver al inicio.
- **Informar avistamiento**: se guarda el avistamiento con sus fotos o videos.
- **Listado**: 5 avistamientos por pagina. Al hacer clic en uno se ve su detalle con las fotos y videos.
- **Estadisticas**: siguen con los datos de ejemplo de la tarea 1.

## Como lanzarlo

Crear la base de datos, en este orden:

```
mysql -u root --default-character-set=utf8mb4 < sql/tarea2.sql
mysql -u root --default-character-set=utf8mb4 tarea2 < sql/region-comuna.sql
mysql -u root --default-character-set=utf8mb4 tarea2 < sql/aves.sql
mysql -u root --default-character-set=utf8mb4 < sql/ajustes.sql
```

Instalar y lanzar:

```
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Despues abrir http://127.0.0.1:5001 (uso el puerto 5001 porque en Mac el 5000 lo ocupa AirPlay).

Si root tiene contraseña, agregar `-p` a los comandos `mysql`.

En Windows:
- los comandos `mysql` con `<` funcionan en cmd, no en PowerShell
- activar el entorno con `.venv\Scripts\activate`
- usar `python` en vez de `python3`

## Lo que conviene saber

- **No cambie `tarea2.sql`.** Mis cambios a la base estan en `sql/ajustes.sql`: agregue la fecha de nacimiento y la calle del voluntario, la cantidad y la comuna del avistamiento, deje el telefono opcional y el correo unico. Asi el formulario de la tarea 1 no pierde ningun campo.
- **Saque el "tipo de ave"** porque la tabla `ave` no tiene tipo. Ahora el ave se elige de una lista.
- **Se valida dos veces.** El JavaScript avisa rapido al usuario. El servidor revisa todo de nuevo, porque el JavaScript se puede desactivar. El servidor ademas revisa que el correo exista o no este repetido, que la comuna sea de la region, y que los archivos sean de verdad imagenes o videos.
- **Archivos.** Se guardan en `static/uploads/` con un nombre al azar, para que no se pisen. En la tabla `registro` queda la ruta y el nombre original.
- **Seguridad.** Las consultas SQL usan parametros y Jinja escapa todo lo que muestra, asi que un texto malicioso no hace nada.
