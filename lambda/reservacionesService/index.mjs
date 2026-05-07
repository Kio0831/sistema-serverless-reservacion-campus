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

async function columnExists(conn, tableName, columnName) {
  const [rows] = await conn.execute(
    `SELECT COUNT(*) AS total
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?`,
    [tableName, columnName]
  );

  return rows[0].total > 0;
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
    `CREATE TABLE IF NOT EXISTS reservaciones (
      id INT AUTO_INCREMENT PRIMARY KEY,
      espacio_id INT NOT NULL,
      solicitante_nombre VARCHAR(100) NOT NULL,
      solicitante_email VARCHAR(150) NOT NULL,
      fecha_inicio DATETIME NOT NULL,
      fecha_fin DATETIME NOT NULL,
      motivo VARCHAR(200),
      estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVA',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      canceled_at DATETIME NULL,
      CONSTRAINT fk_reservaciones_espacios
        FOREIGN KEY (espacio_id) REFERENCES espacios(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
    )`
  );

  const [rows] = await conn.execute("SELECT COUNT(*) AS total FROM espacios");
  if (rows[0].total === 0) {
    await conn.query(
      `INSERT INTO espacios (nombre, edificio, capacidad, disponible)
       VALUES
        ('Aula A101', 'Edificio A', 30, TRUE),
        ('Laboratorio 2', 'Edificio de Ingenieria', 25, FALSE),
        ('Auditorio Principal', 'Centro Cultural', 120, TRUE)`
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

async function listReservaciones(conn) {
  const [rows] = await conn.execute(
    `SELECT r.id, r.espacio_id, e.nombre AS espacio_nombre, r.solicitante_nombre,
            r.solicitante_email, r.fecha_inicio, r.fecha_fin, r.motivo,
            r.estado, r.created_at, r.canceled_at
     FROM reservaciones r
     INNER JOIN espacios e ON e.id = r.espacio_id
     ORDER BY r.fecha_inicio ASC`
  );

  return response(200, {
    mensaje: "Consulta de reservaciones exitosa",
    total: rows.length,
    reservaciones: rows
  });
}

async function createReservacion(conn, payload) {
  const {
    espacio_id,
    solicitante_nombre,
    solicitante_email,
    fecha_inicio,
    fecha_fin,
    motivo = null
  } = payload;

  if (!espacio_id || !solicitante_nombre || !solicitante_email || !fecha_inicio || !fecha_fin) {
    return response(400, {
      mensaje: "espacio_id, solicitante_nombre, solicitante_email, fecha_inicio y fecha_fin son obligatorios"
    });
  }

  const inicio = new Date(fecha_inicio);
  const fin = new Date(fecha_fin);

  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
    return response(400, { mensaje: "Las fechas enviadas no son validas" });
  }

  if (fin <= inicio) {
    return response(400, { mensaje: "fecha_fin debe ser posterior a fecha_inicio" });
  }

  const [espacios] = await conn.execute(
    `SELECT id, nombre, disponible
     FROM espacios
     WHERE id = ?`,
    [espacio_id]
  );

  if (espacios.length === 0) {
    return response(404, { mensaje: "El espacio solicitado no existe" });
  }

  if (!espacios[0].disponible) {
    return response(409, { mensaje: "El espacio no esta disponible para reservaciones" });
  }

  const [overlaps] = await conn.execute(
    `SELECT id
     FROM reservaciones
     WHERE espacio_id = ?
       AND estado = 'ACTIVA'
       AND fecha_inicio < ?
       AND fecha_fin > ?`,
    [espacio_id, fecha_fin, fecha_inicio]
  );

  if (overlaps.length > 0) {
    return response(409, {
      mensaje: "Ya existe una reservacion activa que se traslapa con ese horario"
    });
  }

  const [result] = await conn.execute(
    `INSERT INTO reservaciones
      (espacio_id, solicitante_nombre, solicitante_email, fecha_inicio, fecha_fin, motivo)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [espacio_id, solicitante_nombre, solicitante_email, fecha_inicio, fecha_fin, motivo]
  );

  return response(201, {
    mensaje: "Reservacion creada correctamente",
    id: result.insertId
  });
}

async function cancelReservacion(conn, id) {
  const [rows] = await conn.execute(
    `SELECT id, estado, fecha_inicio
     FROM reservaciones
     WHERE id = ?`,
    [id]
  );

  if (rows.length === 0) {
    return response(404, { mensaje: "Reservacion no encontrada" });
  }

  const reservacion = rows[0];

  if (reservacion.estado === 'CANCELADA') {
    return response(409, { mensaje: "La reservacion ya estaba cancelada" });
  }

  const ahora = new Date();
  if (new Date(reservacion.fecha_inicio) <= ahora) {
    return response(409, {
      mensaje: "No es posible cancelar una reservacion que ya inicio o ya ocurrio"
    });
  }

  await conn.execute(
    `UPDATE reservaciones
     SET estado = 'CANCELADA', canceled_at = NOW()
     WHERE id = ?`,
    [id]
  );

  return response(200, { mensaje: "Reservacion cancelada correctamente" });
}

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return response(200, { mensaje: "CORS OK" });
  }

  try {
    const conn = await getConnection();
    await ensureSchema(conn);

    const method = event.requestContext?.http?.method || event.httpMethod;
    const id = event.pathParameters?.id;
    const action = event.pathParameters?.action;
    const body = event.body ? JSON.parse(event.body) : {};

    if (method === "GET") {
      return await listReservaciones(conn);
    }

    if (method === "POST") {
      return await createReservacion(conn, body);
    }

    if (method === "PATCH" && id && action === "cancelar") {
      return await cancelReservacion(conn, id);
    }

    return response(405, { mensaje: "Metodo no permitido" });
  } catch (error) {
    console.error("Error en reservacionesService:", error);
    return response(500, {
      mensaje: "Error interno del servidor",
      detalle: error.message
    });
  }
};
