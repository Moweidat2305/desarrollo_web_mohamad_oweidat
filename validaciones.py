"""Validaciones del lado del servidor.

Repiten las reglas del JavaScript, porque el JavaScript se puede desactivar
o saltar enviando el formulario directamente.
"""
import os
import re
from datetime import date, datetime, time, timedelta

import db

REGEX_EMAIL = r"[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}"
REGEX_NOMBRE = r"[a-záéíóúñüA-ZÁÉÍÓÚÑÜ ]+"
REGEX_CELULAR = r"(\+?56)?\s?9\s?[0-9]{4}\s?[0-9]{4}"

EXTENSIONES_PERMITIDAS = {"jpg", "jpeg", "png", "gif", "webp", "mp4", "mov", "webm"}
MAX_TAMANO = 50 * 1024 * 1024  # 50 MB por archivo
MAX_ARCHIVOS = 5


def a_entero(texto):
    """Convierte un texto a entero, o devuelve None si no es un numero."""
    try:
        return int(texto)
    except ValueError:
        return None


def edad(nacimiento):
    hoy = date.today()
    anios = hoy.year - nacimiento.year
    if (hoy.month, hoy.day) < (nacimiento.month, nacimiento.day):
        anios -= 1  # todavia no cumple anios este anio
    return anios


def extension(nombre_archivo):
    if "." not in nombre_archivo:
        return ""
    return nombre_archivo.rsplit(".", 1)[1].lower()


def tamano(archivo):
    """Tamano en bytes de un archivo subido: se va al final y se vuelve al inicio."""
    archivo.stream.seek(0, os.SEEK_END)
    bytes_totales = archivo.stream.tell()
    archivo.stream.seek(0)
    return bytes_totales


# ---------- Voluntario ----------

def validar_voluntario(form):
    """Devuelve (errores, datos).

    errores: diccionario campo -> mensaje. Si esta vacio, todo esta bien.
    datos: los valores limpios, listos para insertar en la tabla voluntario.
    """
    errores = {}

    nombre = form.get("name", "").strip()
    if nombre == "":
        errores["name"] = "Ingresa tu nombre completo."
    elif len(nombre) > 255 or not re.fullmatch(REGEX_NOMBRE, nombre):
        errores["name"] = "El nombre solo puede contener letras y espacios."

    nacimiento_texto = form.get("birth-date", "").strip()
    nacimiento = None
    if nacimiento_texto != "":
        try:
            nacimiento = date.fromisoformat(nacimiento_texto)
        except ValueError:
            errores["birth-date"] = "La fecha de nacimiento no es válida."
        else:
            if edad(nacimiento) < 14:
                errores["birth-date"] = "Debes tener al menos 14 años."
            elif edad(nacimiento) > 120:
                errores["birth-date"] = "Revisa la fecha, parece incorrecta."

    email = form.get("email", "").strip()
    if email == "":
        errores["email"] = "Ingresa tu correo electrónico."
    elif len(email) > 80 or not re.fullmatch(REGEX_EMAIL, email):
        errores["email"] = "El correo no tiene un formato válido."
    elif db.email_registrado(email):
        errores["email"] = "Ya existe un voluntario registrado con este correo."

    telefono = form.get("phone", "").strip()
    if telefono != "" and not re.fullmatch(REGEX_CELULAR, telefono):
        errores["phone"] = "El celular debe tener 9 dígitos y empezar con 9."

    region_id = a_entero(form.get("region", ""))
    comuna_id = a_entero(form.get("commune", ""))
    if region_id is None:
        errores["region"] = "Selecciona tu región."
    if comuna_id is None:
        errores["commune"] = "Selecciona tu comuna."
    elif region_id is not None and not db.comuna_en_region(comuna_id, region_id):
        errores["commune"] = "La comuna no corresponde a la región elegida."

    calle = form.get("street", "").strip()
    if len(calle) > 120:
        errores["street"] = "La dirección no puede superar los 120 caracteres."

    datos = {
        "nombre": nombre,
        "email": email,
        "telefono": telefono or None,  # campo vacio -> NULL en la base
        "fecha_nacimiento": nacimiento,
        "calle": calle or None,
        "comuna_id": comuna_id,
    }
    return errores, datos


# ---------- Avistamiento ----------

def validar_avistamiento(form, archivos):
    """Devuelve (errores, datos, archivos).

    datos: valores limpios para la tabla avistamiento.
    archivos: solo los archivos realmente adjuntados.
    """
    errores = {}

    email = form.get("volunteer-email", "").strip()
    voluntario_id = None
    if email == "":
        errores["volunteer-email"] = "Ingresa el correo con el que te registraste."
    elif not re.fullmatch(REGEX_EMAIL, email):
        errores["volunteer-email"] = "El correo no tiene un formato válido."
    else:
        voluntario_id = db.id_voluntario(email)
        if voluntario_id is None:
            errores["volunteer-email"] = "No hay ningún voluntario registrado con este correo."

    ave_id = a_entero(form.get("bird", ""))
    if ave_id is None or not db.ave_existe(ave_id):
        errores["bird"] = "Selecciona el ave que viste."

    cantidad_texto = form.get("quantity", "").strip()
    cantidad = None
    if cantidad_texto != "":
        cantidad = a_entero(cantidad_texto)
        if cantidad is None or cantidad < 1 or cantidad > 10000:
            errores["quantity"] = "La cantidad debe ser un número entero entre 1 y 10.000."

    region_id = a_entero(form.get("sighting-region", ""))
    comuna_id = a_entero(form.get("sighting-commune", ""))
    if region_id is None:
        errores["sighting-region"] = "Selecciona la región."
    if comuna_id is None:
        errores["sighting-commune"] = "Selecciona la comuna."
    elif region_id is not None and not db.comuna_en_region(comuna_id, region_id):
        errores["sighting-commune"] = "La comuna no corresponde a la región elegida."

    lugar = form.get("place", "").strip()
    if len(lugar) < 3 or len(lugar) > 100:
        errores["place"] = "Describe el lugar en entre 3 y 100 caracteres."

    # Fecha y hora se validan por separado y despues se juntan en fecha_hora
    fecha_texto = form.get("date", "").strip()
    hora_texto = form.get("time", "").strip()
    fecha = None
    hora = None
    try:
        fecha = date.fromisoformat(fecha_texto)
    except ValueError:
        errores["date"] = "Ingresa una fecha válida."
    else:
        if fecha > date.today():
            errores["date"] = "La fecha no puede estar en el futuro."
        elif fecha < date.today() - timedelta(days=365):
            errores["date"] = "El avistamiento no puede tener más de un año de antigüedad."
    try:
        hora = time.fromisoformat(hora_texto)
    except ValueError:
        errores["time"] = "Ingresa una hora válida."

    fecha_hora = None
    if fecha is not None and hora is not None:
        fecha_hora = datetime.combine(fecha, hora)
        if fecha_hora > datetime.now():
            errores["time"] = "La hora no puede ser posterior a la actual."

    # Un input file vacio igual envia un archivo sin nombre: se descarta
    archivos = [archivo for archivo in archivos if archivo.filename != ""]
    if len(archivos) == 0:
        errores["files"] = "Debes adjuntar al menos una foto o video."
    elif len(archivos) > MAX_ARCHIVOS:
        errores["files"] = "Máximo 5 archivos por avistamiento."
    else:
        for archivo in archivos:
            es_imagen_o_video = archivo.mimetype.startswith(("image/", "video/"))
            if extension(archivo.filename) not in EXTENSIONES_PERMITIDAS or not es_imagen_o_video:
                errores["files"] = "El archivo " + archivo.filename + " no es una imagen ni un video permitido."
                break
            if tamano(archivo) > MAX_TAMANO:
                errores["files"] = "El archivo " + archivo.filename + " supera los 50 MB."
                break

    comentario = form.get("comment", "").strip()
    if len(comentario) > 500:
        errores["comment"] = "El comentario no puede superar los 500 caracteres."

    # El navegador no puede volver a llenar un input file, hay que avisarle al usuario
    if errores and "files" not in errores:
        errores["files"] = "Vuelve a adjuntar tus archivos."

    datos = {
        "voluntario_id": voluntario_id,
        "ave_id": ave_id,
        "fecha_hora": fecha_hora,
        "lugar": lugar,
        "descripcion": comentario or None,
        "cantidad": cantidad,
        "comuna_id": comuna_id,
    }
    return errores, datos, archivos
