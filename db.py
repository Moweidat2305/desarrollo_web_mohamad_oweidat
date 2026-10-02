"""Conexion y consultas a la base de datos tarea2 con SQLAlchemy."""
from sqlalchemy import create_engine, text

DB_URL = "mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2?charset=utf8mb4"
engine = create_engine(DB_URL)


def consultar(sql, **parametros):
    """Ejecuta un SELECT y devuelve las filas como lista de diccionarios.

    Los valores van como parametros (:nombre en el SQL), nunca pegados al texto,
    asi SQLAlchemy los escapa y se evita la inyeccion SQL.
    """
    with engine.connect() as conn:
        filas = conn.execute(text(sql), parametros).mappings().all()
    return [dict(fila) for fila in filas]


def obtener_regiones():
    return consultar("SELECT id, nombre FROM region ORDER BY nombre")


def obtener_comunas():
    return consultar("SELECT id, nombre, region_id FROM comuna ORDER BY nombre")


def obtener_aves():
    return consultar("SELECT id, nombre FROM ave ORDER BY nombre")


def ultimos_avistamientos(cantidad):
    """Los ultimos avistamientos agregados: el id mas alto es el insertado mas tarde."""
    return consultar(
        """
        SELECT a.id, a.fecha_hora, a.lugar,
               ave.nombre AS ave, c.nombre AS comuna, v.nombre AS voluntario
        FROM avistamiento a
        JOIN ave ON ave.id = a.ave_id
        JOIN comuna c ON c.id = a.comuna_id
        JOIN voluntario v ON v.id = a.voluntario_id
        ORDER BY a.id DESC
        LIMIT :cantidad
        """,
        cantidad=cantidad,
    )


def email_registrado(email):
    filas = consultar("SELECT id FROM voluntario WHERE email = :email", email=email)
    return len(filas) > 0


def comuna_en_region(comuna_id, region_id):
    filas = consultar(
        "SELECT id FROM comuna WHERE id = :comuna AND region_id = :region",
        comuna=comuna_id,
        region=region_id,
    )
    return len(filas) > 0


def insertar_voluntario(datos):
    """Inserta un voluntario. fecha_registro es el momento de la insercion."""
    with engine.begin() as conn:  # begin: hace COMMIT al final si no hubo error
        conn.execute(
            text(
                """
                INSERT INTO voluntario
                    (nombre, email, telefono, fecha_registro, comuna_id, fecha_nacimiento, calle)
                VALUES
                    (:nombre, :email, :telefono, NOW(), :comuna_id, :fecha_nacimiento, :calle)
                """
            ),
            datos,
        )


def id_voluntario(email):
    """Devuelve el id del voluntario con ese correo, o None si no existe."""
    filas = consultar("SELECT id FROM voluntario WHERE email = :email", email=email)
    if filas:
        return filas[0]["id"]
    return None


def ave_existe(ave_id):
    filas = consultar("SELECT id FROM ave WHERE id = :id", id=ave_id)
    return len(filas) > 0


def insertar_avistamiento(datos, registros):
    """Inserta el avistamiento y una fila en registro por cada archivo.

    registros: lista de (ruta_archivo, nombre_archivo).
    Todo va en una sola transaccion: si algo falla, no queda nada a medias.
    """
    with engine.begin() as conn:
        resultado = conn.execute(
            text(
                """
                INSERT INTO avistamiento
                    (voluntario_id, ave_id, fecha_hora, lugar, descripcion, cantidad, comuna_id)
                VALUES
                    (:voluntario_id, :ave_id, :fecha_hora, :lugar, :descripcion, :cantidad, :comuna_id)
                """
            ),
            datos,
        )
        avistamiento_id = resultado.lastrowid

        for ruta, nombre in registros:
            conn.execute(
                text(
                    """
                    INSERT INTO registro (ruta_archivo, nombre_archivo, avistamiento_id)
                    VALUES (:ruta, :nombre, :avistamiento_id)
                    """
                ),
                {"ruta": ruta, "nombre": nombre, "avistamiento_id": avistamiento_id},
            )


def contar_avistamientos():
    return consultar("SELECT COUNT(*) AS total FROM avistamiento")[0]["total"]


def pagina_avistamientos(pagina, por_pagina):
    """Los avistamientos de una pagina, del mas reciente al mas antiguo."""
    return consultar(
        """
        SELECT a.id, a.fecha_hora, a.lugar,
               ave.nombre AS ave, c.nombre AS comuna, v.nombre AS voluntario,
               (SELECT COUNT(*) FROM registro r WHERE r.avistamiento_id = a.id) AS total_archivos
        FROM avistamiento a
        JOIN ave ON ave.id = a.ave_id
        JOIN comuna c ON c.id = a.comuna_id
        JOIN voluntario v ON v.id = a.voluntario_id
        ORDER BY a.fecha_hora DESC, a.id DESC
        LIMIT :limite OFFSET :desde
        """,
        limite=por_pagina,
        desde=(pagina - 1) * por_pagina,
    )


def obtener_avistamiento(avistamiento_id):
    """Un avistamiento con todos sus datos, o None si no existe."""
    filas = consultar(
        """
        SELECT a.id, a.fecha_hora, a.lugar, a.descripcion, a.cantidad,
               ave.nombre AS ave, c.nombre AS comuna, reg.nombre AS region,
               v.nombre AS voluntario
        FROM avistamiento a
        JOIN ave ON ave.id = a.ave_id
        JOIN comuna c ON c.id = a.comuna_id
        JOIN region reg ON reg.id = c.region_id
        JOIN voluntario v ON v.id = a.voluntario_id
        WHERE a.id = :id
        """,
        id=avistamiento_id,
    )
    if filas:
        return filas[0]
    return None


def archivos_de_avistamiento(avistamiento_id):
    return consultar(
        "SELECT ruta_archivo, nombre_archivo FROM registro WHERE avistamiento_id = :id ORDER BY id",
        id=avistamiento_id,
    )
