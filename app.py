"""Tarea 2: aplicacion Flask para registrar avistamientos de aves."""
import math
import os
import uuid

from flask import Flask, abort, flash, redirect, render_template, request, url_for
from werkzeug.utils import secure_filename

import db
from validaciones import validar_avistamiento, validar_voluntario

app = Flask(__name__)
app.secret_key = os.urandom(24)  # firma la cookie de los mensajes flash

# Limite total de una peticion: 5 archivos de 50 MB mas el resto del formulario.
# Si se supera, Flask responde 413 sin leer todo (ver envio_muy_grande mas abajo).
app.config["MAX_CONTENT_LENGTH"] = 260 * 1024 * 1024

CARPETA_UPLOADS = os.path.join(app.static_folder, "uploads")
POR_PAGINA = 5
EXTENSIONES_VIDEO = (".mp4", ".mov", ".webm")


def guardar_archivos(archivos):
    """Guarda cada archivo con un nombre unico y devuelve [(ruta, nombre_original)].

    El nombre en disco es aleatorio (uuid): asi dos archivos con el mismo nombre
    no se pisan y nadie puede elegir la ruta donde se guarda.
    """
    os.makedirs(CARPETA_UPLOADS, exist_ok=True)
    registros = []
    for archivo in archivos:
        extension = archivo.filename.rsplit(".", 1)[1].lower()
        nombre_en_disco = uuid.uuid4().hex + "." + extension
        archivo.save(os.path.join(CARPETA_UPLOADS, nombre_en_disco))
        nombre_original = secure_filename(archivo.filename)[:300]
        registros.append(("uploads/" + nombre_en_disco, nombre_original))
    return registros


@app.route("/")
def index():
    return render_template("index.html", ultimos=db.ultimos_avistamientos(2))


@app.route("/registro", methods=["GET", "POST"])
def registro():
    valores = {}
    errores = {}

    if request.method == "POST":
        valores = request.form
        errores, datos = validar_voluntario(request.form)
        if not errores:
            db.insertar_voluntario(datos)
            return render_template("registro_ok.html", nombre=datos["nombre"], email=datos["email"])

    # GET, o POST con errores: se muestra el formulario con lo que escribio el usuario
    return render_template(
        "registro.html",
        regiones=db.obtener_regiones(),
        comunas=db.obtener_comunas(),
        valores=valores,
        errores=errores,
    )


@app.route("/avistamiento", methods=["GET", "POST"])
def avistamiento():
    errores = {}

    if request.method == "POST":
        valores = request.form
        errores, datos, archivos = validar_avistamiento(request.form, request.files.getlist("files"))
        if not errores:
            registros = guardar_archivos(archivos)
            try:
                db.insertar_avistamiento(datos, registros)
            except Exception:
                # Si la base falla, se borran los archivos para no dejar basura en el disco
                for ruta, nombre in registros:
                    os.remove(os.path.join(app.static_folder, ruta))
                raise
            flash("¡Gracias! Tu avistamiento quedó registrado.")
            return redirect(url_for("index"))
    else:
        # Si viene desde el registro, el correo del voluntario llega en la URL
        valores = {"volunteer-email": request.args.get("email", "")}

    return render_template(
        "avistamiento.html",
        regiones=db.obtener_regiones(),
        comunas=db.obtener_comunas(),
        aves=db.obtener_aves(),
        valores=valores,
        errores=errores,
    )


@app.route("/listado")
def listado():
    total = db.contar_avistamientos()
    total_paginas = max(1, math.ceil(total / POR_PAGINA))

    # type=int: si en la URL viene algo que no es un numero, se usa 1
    pagina = request.args.get("pagina", 1, type=int)
    if pagina < 1:
        pagina = 1
    if pagina > total_paginas:
        pagina = total_paginas

    return render_template(
        "listado.html",
        avistamientos=db.pagina_avistamientos(pagina, POR_PAGINA),
        pagina=pagina,
        total_paginas=total_paginas,
        total=total,
    )


@app.route("/detalle/<int:avistamiento_id>")
def detalle(avistamiento_id):
    # <int:...> hace que Flask responda 404 si el id no es un numero
    avistamiento = db.obtener_avistamiento(avistamiento_id)
    if avistamiento is None:
        abort(404)

    archivos = db.archivos_de_avistamiento(avistamiento_id)
    for archivo in archivos:
        archivo["es_video"] = archivo["ruta_archivo"].endswith(EXTENSIONES_VIDEO)

    return render_template("detalle.html", a=avistamiento, archivos=archivos)


@app.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas.html")


@app.errorhandler(413)
def envio_muy_grande(error):
    """Si el envio supera MAX_CONTENT_LENGTH, se vuelve al formulario con un mensaje claro."""
    errores = {"files": "Los archivos son demasiado grandes. Máximo 50 MB cada uno."}
    return render_template(
        "avistamiento.html",
        regiones=db.obtener_regiones(),
        comunas=db.obtener_comunas(),
        aves=db.obtener_aves(),
        valores={},
        errores=errores,
    ), 413


if __name__ == "__main__":
    # En macOS el puerto 5000 lo usa AirPlay, por eso 5001
    app.run(debug=True, port=5001)
