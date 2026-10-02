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
