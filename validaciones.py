"""Validaciones del lado del servidor.

Repiten las reglas del JavaScript, porque el JavaScript se puede desactivar
o saltar enviando el formulario directamente.
"""
import re
from datetime import date

import db

REGEX_EMAIL = r"[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}"
REGEX_NOMBRE = r"[a-záéíóúñüA-ZÁÉÍÓÚÑÜ ]+"
REGEX_CELULAR = r"(\+?56)?\s?9\s?[0-9]{4}\s?[0-9]{4}"


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
