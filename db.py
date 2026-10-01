"""Conexion a la base de datos tarea2 con SQLAlchemy."""
from sqlalchemy import create_engine, text

DB_URL = "mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2?charset=utf8mb4"
engine = create_engine(DB_URL)

# Prueba rapida de la conexion: python db.py
if __name__ == "__main__":
    with engine.connect() as conn:
        total = conn.execute(text("SELECT COUNT(*) FROM ave")).scalar()
        print("Conexion OK,", total, "aves en la base")
