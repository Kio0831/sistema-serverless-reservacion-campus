CREATE TABLE IF NOT EXISTS espacios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  edificio VARCHAR(100) NOT NULL,
  capacidad INT NOT NULL,
  disponible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  fecha DATETIME NOT NULL,
  espacio_id INT NOT NULL,
  responsable VARCHAR(100) NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_eventos_espacios
    FOREIGN KEY (espacio_id) REFERENCES espacios(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

INSERT INTO espacios (nombre, edificio, capacidad, disponible)
VALUES
  ('Aula A101', 'Edificio A', 30, TRUE),
  ('Laboratorio 2', 'Edificio de Ingenieria', 25, FALSE),
  ('Auditorio Principal', 'Centro Cultural', 120, TRUE)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);
