CREATE TABLE IF NOT EXISTS reservaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  espacio_id INT NOT NULL,
  solicitante_nombre VARCHAR(100) NOT NULL,
  solicitante_email VARCHAR(150) NOT NULL,
  fecha_inicio DATETIME NOT NULL,
  fecha_fin DATETIME NOT NULL,
  motivo VARCHAR(200),
  estado VARCHAR(20) NOT NULL DEFAULT ''ACTIVA'',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  canceled_at DATETIME NULL,
  CONSTRAINT fk_reservaciones_espacios
    FOREIGN KEY (espacio_id) REFERENCES espacios(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

ALTER TABLE eventos
  ADD COLUMN IF NOT EXISTS cupo_maximo INT NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS cupo_disponible INT NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS estado VARCHAR(20) NOT NULL DEFAULT ''ACTIVO'';

CREATE TABLE IF NOT EXISTS registros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  evento_id INT NOT NULL,
  usuario_id INT NOT NULL,
  usuario_nombre VARCHAR(100) NOT NULL,
  usuario_email VARCHAR(150) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT ''ACTIVO'',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  canceled_at DATETIME NULL,
  CONSTRAINT fk_registros_eventos
    FOREIGN KEY (evento_id) REFERENCES eventos(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  UNIQUE KEY uk_evento_usuario_activo (evento_id, usuario_id)
);
