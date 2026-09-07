# Tarea 1 - Registro de avistamientos de aves - Mohamad Oweidat


## Estructura

```
tarea1/
├── README.md
├── html/     una pagina por funcionalidad
├── css/      una hoja de estilos por pagina con el mismo nombre
└── js/       un script por pagina + tres compartidos
```

## Paginas

| Archivo | Qué hace |
|---|---|
| `index.html` | Portada con contadores y explicacion de como participar |
| `registro.html` | Formulario de registro de voluntario(a) |
| `avistamiento.html` | Formulario para informar un avistamiento |
| `listado.html` | Tabla de avistamientos con filtro por tipo, orden por columna y paginación |
| `estadisticas.html` | Cuatro graficos sobre voluntarios y avistamientos |



En `js/` hay un script por página más tres compartidos: `regiones.js` (regiones y comunas), `validaciones.js` (reglas comunes a ambos formularios) y `datos-ejemplo.js` (datos inventados para poblar el listado y los graficos).

## Decisiones que conviene tener en cuenta

- **Regiones y comunas.** Están en `regiones.js` como un objeto. No incluí las 346 comunas del país, solo las más pobladas de cada una de las 16 regiones, que es suficiente para el prototipo. El select de comunas se llena según la región elegida y queda deshabilitado mientras no haya región.
- **Reglas de validación definidas:**
  - Nombre: obligatorio.
  - Fecha de nacimiento: opcional; si se ingresa al menos 14 años y no mas de 120.
  - Email: obligatorio, formato `correo@ejemplo.cl`.
  - Celular: opcional; formato chileno de 9 dígitos empezando por 9, con o sin `+56` y espacios.
  - Región y comuna: obligatorias (select).
  - Calle: opcional maximo 120 caracteres.
  - Tipo y nombre del ave: obligatorios; nombre entre 2 y 60 caracteres.
  - Cantidad de individuos: opcional, entero entre 1 y 10000.
  - Lugar: obligatorio, 3 a 100 caracteres.
  - Fecha del avistamiento: obligatoria, no futura y no mas de un año atras.
  - Hora: obligatoria; si la fecha es hoy, no puede ser posterior a la hora actual.
  - Archivos: entre 1 y 5, extensiones de imagen o video, maximo 50 MB cada uno. Se revisa la extension del nombre y el tamaño desde el objeto `File`.
  - Comentario: opcional, maximo 500 caracteres.
- **Al enviar un formulario válido** no se envía nada a ningun lado (no hay servidor); se oculta el formulario y se muestra un mensaje de éxito con un enlace a la siguiente accion. El enunciado indica que no es necesario almacenar lo que ingresa el usuario, asi que el listado y los graficos muestran solo los datos de ejemplo.
- **Listado.** Los datos son ficticios (`datos-ejemplo.js`). Se ordena haciendo clic en el encabezado de la columna; un segundo clic invierte el orden. Por defecto se muestran los mas recientes primero, 5 por pagina, configurable. El filtro por tipo reinicia a la pagina 1.
- **Graficos.** Usé Chart.js cargado desde CDN asi que la pagina de estadisticas necesita conexion a internet. Los conteos se calculan en `estadisticas.js` a partir de los datos de ejemplo.
- **HTML semántico.** Cada página usa `header`, `nav`, `main`, `section`, `fieldset`/`legend`, `table` con `caption`, y `footer`. No hay `div`.
- **Validadores W3C.** HTML y CSS pasan sin errores.
