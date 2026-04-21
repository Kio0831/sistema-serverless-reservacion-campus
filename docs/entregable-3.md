# Entregable 3: Infraestructura base

## 1. Repositorio Git

Se creo un repositorio Git para versionar el proyecto "Sistema Serverless de Reservacion de Espacios en Campus". La estructura inicial separa claramente la capa de presentacion (`frontend/`), la logica serverless (`lambda/`) y la documentacion (`docs/`), facilitando el mantenimiento y futuras ampliaciones.

## 2. Sitio estatico en Amazon S3

Se implemento un sitio estatico minimo en Amazon S3 utilizando un archivo `index.html`. Este frontend permite capturar la URL del endpoint publicado en Amazon API Gateway y ejecutar una consulta HTTP para validar la comunicacion con la capa serverless.

## 3. Primera funcion Lambda

Se desarrollo una funcion AWS Lambda en Node.js con la responsabilidad de atender la operacion `GET /espacios`. La funcion devuelve una respuesta JSON con datos simulados de espacios del campus, suficientes para comprobar la integracion inicial del sistema.

## 4. Primer endpoint en API Gateway

Se propone la publicacion del endpoint `GET /espacios` mediante Amazon API Gateway, enlazado directamente con la funcion Lambda. Esta configuracion constituye la primera interfaz publica del sistema y habilita pruebas desde navegador, Postman o el frontend desplegado en S3.

## 5. Pipeline CI/CD basico

Se definio un flujo inicial de integracion y despliegue continuo mediante GitHub Actions. El pipeline sincroniza automaticamente el contenido del directorio `frontend/` hacia un bucket S3 cada vez que se realiza un cambio en la rama principal del repositorio.

## 6. Evidencia de funcionamiento

La evidencia esperada para este entregable consiste en:

- Captura del bucket S3 con el sitio desplegado
- Captura de la configuracion de Lambda
- Captura de la configuracion del endpoint en API Gateway
- Captura de la URL del endpoint respondiendo correctamente
- Captura del frontend consumiendo el endpoint y mostrando el JSON recibido

## 7. Resultado esperado del endpoint

El endpoint `GET /espacios` debe responder con un objeto JSON similar al siguiente:

```json
{
  "mensaje": "Consulta de espacios exitosa",
  "total": 3,
  "espacios": [
    {
      "id": "A101",
      "nombre": "Aula A101",
      "edificio": "Edificio A",
      "capacidad": 30,
      "disponible": true
    }
  ]
}
```
