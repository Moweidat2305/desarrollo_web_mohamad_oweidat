-- Ajustes al modelo de tarea2.sql para conservar el formulario de la tarea 1
USE tarea2;

-- Voluntario: fecha de nacimiento y calle son opcionales en el formulario
ALTER TABLE voluntario
  ADD COLUMN fecha_nacimiento DATE NULL,
  ADD COLUMN calle VARCHAR(120) NULL,
  MODIFY COLUMN telefono VARCHAR(15) NULL;

-- Un correo corresponde a un solo voluntario
ALTER TABLE voluntario
  ADD UNIQUE INDEX email_UNIQUE (email);

-- Avistamiento: cantidad de individuos y comuna donde se vio el ave
ALTER TABLE avistamiento
  ADD COLUMN cantidad INT NULL,
  ADD COLUMN comuna_id INT NOT NULL;

ALTER TABLE avistamiento
  ADD CONSTRAINT fk_avistamiento_comuna1
    FOREIGN KEY (comuna_id) REFERENCES comuna (id);
