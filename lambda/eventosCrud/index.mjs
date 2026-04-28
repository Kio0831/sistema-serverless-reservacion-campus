import mysql from "mysql2/promise";

let connection;

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

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
    },
    body: JSON.stringify(body)
  };
}

async function listEventos(conn) {
  const [rows] = await conn.execute(
    `SELECT e.id, e.titulo, e.fecha, e.espacio_id, e.responsable, e.descripcion, e.created_at,
            s.nombre AS espacio_nombre
     FROM eventos e
     INNER JOIN espacios s ON s.id = e.espacio_id
     ORDER BY e.id ASC`
  );

  return response(200, {
    mensaje: "Consulta de eventos exitosa",
    total: rows.length,
    eventos: rows
  });
}

async function getEventoById(conn, id) {
  const [rows] = await conn.execute(
    `SELECT e.id, e.titulo, e.fecha, e.espacio_id, e.responsable, e.descripcion, e.created_at,
            s.nombre AS espacio_nombre
     FROM eventos e
     INNER JOIN espacios s ON s.id = e.espacio_id
     WHERE e.id = ?`,
    [id]
  );

  if (rows.length === 0) {
    return response(404, { mensaje: "Evento no encontrado" });
  }

  return response(200, rows[0]);
}

async function createEvento(conn, payload) {
  const { titulo, fecha, espacio_id, responsable, descripcion = null } = payload;

  if (!titulo || !fecha || !espacio_id || !responsable) {
    return response(400, {
      mensaje: "titulo, fecha, espacio_id y responsable son obligatorios"
    });
  }

  const [result] = await conn.execute(
    `INSERT INTO eventos (titulo, fecha, espacio_id, responsable, descripcion)
     VALUES (?, ?, ?, ?, ?)`,
    [titulo, fecha, espacio_id, responsable, descripcion]
  );

  return response(201, {
    mensaje: "Evento creado correctamente",
    id: result.insertId
  });
}

async function updateEvento(conn, id, payload) {
  const { titulo, fecha, espacio_id, responsable, descripcion = null } = payload;

  const [result] = await conn.execute(
    `UPDATE eventos
     SET titulo = ?, fecha = ?, espacio_id = ?, responsable = ?, descripcion = ?
     WHERE id = ?`,
    [titulo, fecha, espacio_id, responsable, descripcion, id]
  );

  if (result.affectedRows === 0) {
    return response(404, { mensaje: "Evento no encontrado" });
  }

  return response(200, { mensaje: "Evento actualizado correctamente" });
}

async function deleteEvento(conn, id) {
  const [result] = await conn.execute(
    `DELETE FROM eventos WHERE id = ?`,
    [id]
  );

  if (result.affectedRows === 0) {
    return response(404, { mensaje: "Evento no encontrado" });
  }

  return response(200, { mensaje: "Evento eliminado correctamente" });
}

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return response(200, { mensaje: "CORS OK" });
  }

  try {
    const conn = await getConnection();
    const method = event.requestContext?.http?.method || event.httpMethod;
    const id = event.pathParameters?.id;
    const body = event.body ? JSON.parse(event.body) : {};

    if (method === "GET" && id) {
      return await getEventoById(conn, id);
    }

    if (method === "GET") {
      return await listEventos(conn);
    }

    if (method === "POST") {
      return await createEvento(conn, body);
    }

    if (method === "PUT" && id) {
      return await updateEvento(conn, id, body);
    }

    if (method === "DELETE" && id) {
      return await deleteEvento(conn, id);
    }

    return response(405, { mensaje: "Metodo no permitido" });
  } catch (error) {
    console.error("Error en eventosCrud:", error);
    return response(500, {
      mensaje: "Error interno del servidor",
      detalle: error.message
    });
  }
};
