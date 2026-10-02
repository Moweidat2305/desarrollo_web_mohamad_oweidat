"""Tarea 2: aplicacion Flask para registrar avistamientos de aves."""
import os

from flask import Flask, render_template

import db

app = Flask(__name__)
app.secret_key = os.urandom(24)  # firma la cookie de los mensajes flash


@app.route("/")
def index():
    return render_template("index.html", ultimos=db.ultimos_avistamientos(2))


@app.route("/registro")
def registro():
    return render_template(
        "registro.html",
        regiones=db.obtener_regiones(),
        comunas=db.obtener_comunas(),
        valores={},
        errores={},
    )


@app.route("/avistamiento")
def avistamiento():
    return render_template(
        "avistamiento.html",
        regiones=db.obtener_regiones(),
        comunas=db.obtener_comunas(),
        aves=db.obtener_aves(),
        valores={},
        errores={},
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
