"""Tarea 2: aplicacion Flask para registrar avistamientos de aves."""
import os
import uuid

from flask import Flask, flash, redirect, render_template, request, url_for
from werkzeug.utils import secure_filename

import db
from validaciones import validar_avistamiento, validar_voluntario

app = Flask(__name__)
app.secret_key = os.urandom(24)  # firma la cookie de los mensajes flash

# Limite total de una peticion: 5 archivos de 50 MB mas el resto del formulario.
# Si se supera, Flask responde 413 sin leer todo.
app.config["MAX_CONTENT_LENGTH"] = 260 * 1024 * 1024

CARPETA_UPLOADS = os.path.join(app.static_folder, "uploads")


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
            db.insertar_avistamiento(datos, registros)
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
    return render_template("listado.html")


@app.route("/estadisticas")
def estadisticas():
    return render_template("estadisticas.html")


if __name__ == "__main__":
    # En macOS el puerto 5000 lo usa AirPlay, por eso 5001
    app.run(debug=True, port=5001)
