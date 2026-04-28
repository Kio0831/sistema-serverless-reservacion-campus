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

async function listEspacios(conn) {
  const [rows] = await conn.execute(
    `SELECT id, nombre, edificio, capacidad, disponible, created_at
     FROM espacios
     ORDER BY id ASC`
  );

  return response(200, {
    mensaje: "Consulta de espacios exitosa",
    total: rows.length,
    espacios: rows
  });
}

async function getEspacioById(conn, id) {
  const [rows] = await conn.execute(
    `SELECT id, nombre, edificio, capacidad, disponible, created_at
     FROM espacios
     WHERE id = ?`,
    [id]
  );

  if (rows.length === 0) {
    return response(404, { mensaje: "Espacio no encontrado" });
  }

  return response(200, rows[0]);
}

async function createEspacio(conn, payload) {
  const { nombre, edificio, capacidad, disponible = true } = payload;

  if (!nombre || !edificio || capacidad === undefined) {
    return response(400, {
      mensaje: "nombre, edificio y capacidad son obligatorios"
    });
  }

  const [result] = await conn.execute(
    `INSERT INTO espacios (nombre, edificio, capacidad, disponible)
     VALUES (?, ?, ?, ?)`,
    [nombre, edificio, capacidad, disponible]
  );

  return response(201, {
    mensaje: "Espacio creado correctamente",
    id: result.insertId
  });
}

async function updateEspacio(conn, id, payload) {
  const { nombre, edificio, capacidad, disponible } = payload;

  const [result] = await conn.execute(
    `UPDATE espacios
     SET nombre = ?, edificio = ?, capacidad = ?, disponible = ?
     WHERE id = ?`,
    [nombre, edificio, capacidad, disponible, id]
  );

  if (result.affectedRows === 0) {
    return response(404, { mensaje: "Espacio no encontrado" });
  }

  return response(200, { mensaje: "Espacio actualizado correctamente" });
}

async function deleteEspacio(conn, id) {
  const [result] = await conn.execute(
    `DELETE FROM espacios WHERE id = ?`,
    [id]
  );

  if (result.affectedRows === 0) {
    return response(404, { mensaje: "Espacio no encontrado" });
  }

  return response(200, { mensaje: "Espacio eliminado correctamente" });
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
      return await getEspacioById(conn, id);
    }

    if (method === "GET") {
      return await listEspacios(conn);
    }

    if (method === "POST") {
      return await createEspacio(conn, body);
    }

    if (method === "PUT" && id) {
      return await updateEspacio(conn, id, body);
    }

    if (method === "DELETE" && id) {
      return await deleteEspacio(conn, id);
    }

    return response(405, { mensaje: "Metodo no permitido" });
  } catch (error) {
    console.error("Error en espaciosCrud:", error);
    return response(500, {
      mensaje: "Error interno del servidor",
      detalle: error.message
    });
  }
};
