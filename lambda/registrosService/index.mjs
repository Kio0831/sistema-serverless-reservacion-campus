import mysql from "mysql2/promise";

let connection;
let schemaReady = false;

async function getConnection() {
  if (connection) {
    return connection;
  }

  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  return connection;
}

async function ensureSchema(conn) {
  if (schemaReady) {
    return;
  }

  await conn.execute(
    `CREATE TABLE IF NOT EXISTS espacios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      edificio VARCHAR(100) NOT NULL,
      capacidad INT NOT NULL,
      disponible BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  );

  await conn.execute(
    `CREATE TABLE IF NOT EXISTS eventos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      titulo VARCHAR(150) NOT NULL,
      fecha DATETIME NOT NULL,
      espacio_id INT NOT NULL,
      responsable VARCHAR(100) NOT NULL,
      descripcion TEXT,
      cupo_maximo INT NOT NULL DEFAULT 30,
      cupo_disponible INT NOT NULL DEFAULT 30,
      estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_eventos_espacios
        FOREIGN KEY (espacio_id) REFERENCES espacios(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
    )`
  );

  await conn.execute(
    `CREATE TABLE IF NOT EXISTS registros (
      id INT AUTO_INCREMENT PRIMARY KEY,
      evento_id INT NOT NULL,
      usuario_id INT NOT NULL,
      usuario_nombre VARCHAR(100) NOT NULL,
      usuario_email VARCHAR(150) NOT NULL,
      estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      canceled_at DATETIME NULL,
      CONSTRAINT fk_registros_eventos
        FOREIGN KEY (evento_id) REFERENCES eventos(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
      UNIQUE KEY uk_evento_usuario_activo (evento_id, usuario_id)
    )`
  );

  const [espacios] = await conn.execute("SELECT COUNT(*) AS total FROM espacios");
  if (espacios[0].total === 0) {
    await conn.query(
      `INSERT INTO espacios (nombre, edificio, capacidad, disponible)
       VALUES
        ('Aula A101', 'Edificio A', 30, TRUE),
        ('Laboratorio 2', 'Edificio de Ingenieria', 25, FALSE),
        ('Auditorio Principal', 'Centro Cultural', 120, TRUE)`
    );
  }

  const [hasCupoMaximo] = await conn.execute(
    `SELECT COUNT(*) AS total
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'eventos'
       AND COLUMN_NAME = 'cupo_maximo'`
  );

  if (hasCupoMaximo[0].total === 0) {
    await conn.execute("ALTER TABLE eventos ADD COLUMN cupo_maximo INT NOT NULL DEFAULT 30");
  }

  const [hasCupoDisponible] = await conn.execute(
    `SELECT COUNT(*) AS total
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'eventos'
       AND COLUMN_NAME = 'cupo_disponible'`
  );

  if (hasCupoDisponible[0].total === 0) {
    await conn.execute("ALTER TABLE eventos ADD COLUMN cupo_disponible INT NOT NULL DEFAULT 30");
  }

  const [hasEstadoEvento] = await conn.execute(
    `SELECT COUNT(*) AS total
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'eventos'
       AND COLUMN_NAME = 'estado'`
  );

  if (hasEstadoEvento[0].total === 0) {
    await conn.execute("ALTER TABLE eventos ADD COLUMN estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO'");
  }

  const [eventos] = await conn.execute("SELECT COUNT(*) AS total FROM eventos");
  if (eventos[0].total === 0) {
    await conn.query(
      `INSERT INTO eventos (titulo, fecha, espacio_id, responsable, descripcion, cupo_maximo, cupo_disponible, estado)
       VALUES
        ('Conferencia de IA', '2026-05-10 18:00:00', 1, 'Clio', 'Evento semilla para registros', 30, 30, 'ACTIVO')`
    );
  }

  schemaReady = true;
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS"
    },
    body: JSON.stringify(body)
  };
}

async function listRegistros(conn) {
  const [rows] = await conn.execute(
    `SELECT r.id, r.evento_id, e.titulo AS evento_titulo, r.usuario_id, r.usuario_nombre,
            r.usuario_email, r.estado, r.created_at, r.canceled_at
     FROM registros r
     INNER JOIN eventos e ON e.id = r.evento_id
     ORDER BY r.created_at DESC`
  );

  return response(200, {
    mensaje: "Consulta de registros exitosa",
    total: rows.length,
    registros: rows
  });
}

async function listRegistrosByEvento(conn, eventoId) {
  const [rows] = await conn.execute(
    `SELECT r.id, r.evento_id, r.usuario_id, r.usuario_nombre, r.usuario_email,
            r.estado, r.created_at, r.canceled_at
     FROM registros r
     WHERE r.evento_id = ?
     ORDER BY r.created_at DESC`,
    [eventoId]
  );

  return response(200, {
    mensaje: "Consulta de asistentes por evento exitosa",
    total: rows.length,
    registros: rows
  });
}

async function listEventosByUsuario(conn, usuarioId) {
  const [rows] = await conn.execute(
    `SELECT r.id AS registro_id, r.estado, r.created_at,
            e.id AS evento_id, e.titulo, e.fecha, e.responsable
     FROM registros r
     INNER JOIN eventos e ON e.id = r.evento_id
     WHERE r.usuario_id = ?
     ORDER BY e.fecha ASC`,
    [usuarioId]
  );

  return response(200, {
    mensaje: "Consulta de eventos por usuario exitosa",
    total: rows.length,
    eventos: rows
  });
}

async function createRegistro(conn, payload) {
  const { evento_id, usuario_id, usuario_nombre, usuario_email } = payload;

  if (!evento_id || !usuario_id || !usuario_nombre || !usuario_email) {
    return response(400, {
      mensaje: "evento_id, usuario_id, usuario_nombre y usuario_email son obligatorios"
    });
  }

  const [eventos] = await conn.execute(
    `SELECT id, titulo, fecha, cupo_disponible, estado
     FROM eventos
     WHERE id = ?`,
    [evento_id]
  );

  if (eventos.length === 0) {
    return response(404, { mensaje: "El evento solicitado no existe" });
  }

  const evento = eventos[0];
  if (evento.estado !== 'ACTIVO') {
    return response(409, { mensaje: "El evento no esta disponible para registros" });
  }

  if (evento.cupo_disponible <= 0) {
    return response(409, { mensaje: "No hay cupo disponible para este evento" });
  }

  const [duplicados] = await conn.execute(
    `SELECT id, estado
     FROM registros
     WHERE evento_id = ?
       AND usuario_id = ?`,
    [evento_id, usuario_id]
  );

  if (duplicados.length > 0) {
    const existente = duplicados[0];
    if (existente.estado === 'ACTIVO') {
      return response(409, { mensaje: "El usuario ya esta registrado en este evento" });
    }

    return response(409, { mensaje: "Ya existe un registro previo para este usuario en el evento" });
  }

  await conn.beginTransaction();
  try {
    const [insert] = await conn.execute(
      `INSERT INTO registros (evento_id, usuario_id, usuario_nombre, usuario_email)
       VALUES (?, ?, ?, ?)`,
      [evento_id, usuario_id, usuario_nombre, usuario_email]
    );

    await conn.execute(
      `UPDATE eventos
       SET cupo_disponible = cupo_disponible - 1
       WHERE id = ?`,
      [evento_id]
    );

    await conn.commit();

    return response(201, {
      mensaje: "Registro creado correctamente",
      id: insert.insertId
    });
  } catch (error) {
    await conn.rollback();
    throw error;
  }
}

async function cancelRegistro(conn, id) {
  const [rows] = await conn.execute(
    `SELECT r.id, r.estado, r.evento_id, e.fecha
     FROM registros r
     INNER JOIN eventos e ON e.id = r.evento_id
     WHERE r.id = ?`,
    [id]
  );

  if (rows.length === 0) {
    return response(404, { mensaje: "Registro no encontrado" });
  }

  const registro = rows[0];

  if (registro.estado === 'CANCELADO') {
    return response(409, { mensaje: "El registro ya estaba cancelado" });
  }

  if (new Date(registro.fecha) <= new Date()) {
    return response(409, {
      mensaje: "No es posible cancelar un registro de un evento que ya ocurrio"
    });
  }

  await conn.beginTransaction();
  try {
    await conn.execute(
      `UPDATE registros
       SET estado = 'CANCELADO', canceled_at = NOW()
       WHERE id = ?`,
      [id]
    );

    await conn.execute(
      `UPDATE eventos
       SET cupo_disponible = cupo_disponible + 1
       WHERE id = ?`,
      [registro.evento_id]
    );

    await conn.commit();
    return response(200, { mensaje: "Registro cancelado correctamente" });
  } catch (error) {
    await conn.rollback();
    throw error;
  }
}

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return response(200, { mensaje: "CORS OK" });
  }

  try {
    const conn = await getConnection();
    await ensureSchema(conn);

    const method = event.requestContext?.http?.method || event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};
    const path = event.rawPath || event.path || "";
    const registroId = event.pathParameters?.id;
    const usuarioId = event.pathParameters?.usuarioId;
    const eventoId = event.pathParameters?.eventoId;
    const action = event.pathParameters?.action;

    if (method === "GET" && path.includes("/eventos/") && path.includes("/registros")) {
      return await listRegistrosByEvento(conn, eventoId);
    }

    if (method === "GET" && path.includes("/usuarios/") && path.includes("/eventos")) {
      return await listEventosByUsuario(conn, usuarioId);
    }

    if (method === "GET") {
      return await listRegistros(conn);
    }

    if (method === "POST") {
      return await createRegistro(conn, body);
    }

    if (method === "PATCH" && registroId && action === "cancelar") {
      return await cancelRegistro(conn, registroId);
    }

    return response(405, { mensaje: "Metodo no permitido" });
  } catch (error) {
    console.error("Error en registrosService:", error);
    return response(500, {
      mensaje: "Error interno del servidor",
      detalle: error.message
    });
  }
};
