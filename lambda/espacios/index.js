exports.handler = async () => {
  const espacios = [
    {
      id: "A101",
      nombre: "Aula A101",
      edificio: "Edificio A",
      capacidad: 30,
      disponible: true
    },
    {
      id: "LAB2",
      nombre: "Laboratorio 2",
      edificio: "Edificio de Ingenieria",
      capacidad: 25,
      disponible: false
    },
    {
      id: "AUD1",
      nombre: "Auditorio Principal",
      edificio: "Centro Cultural",
      capacidad: 120,
      disponible: true
    }
  ];

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      mensaje: "Consulta de espacios exitosa",
      total: espacios.length,
      espacios
    })
  };
};

