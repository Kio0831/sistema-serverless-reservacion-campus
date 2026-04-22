# Entregable 3: Infraestructura base en AWS

## 1. Descripcion general

El proyecto "Sistema Serverless de Reservacion de Espacios en Campus" busca establecer una arquitectura inicial basada en servicios administrados de AWS para validar la comunicacion entre una interfaz web y una funcion serverless. En este entregable se construye la primera base tecnica del sistema para demostrar un flujo funcional de consulta de espacios.

## 2. Objetivo del entregable

Completar una primera version operativa con los siguientes componentes:

1. Repositorio Git publicado en GitHub.
2. Sitio web estatico desplegado en Amazon S3.
3. Funcion AWS Lambda inicial.
4. Endpoint `GET /espacios` en Amazon API Gateway.
5. Pipeline CI/CD basico para despliegue del frontend.
6. Evidencia de la integracion funcionando.

## 3. Estructura del proyecto

La estructura base del repositorio se organizo de la siguiente manera:

```text
.
|-- .github/
|   `-- workflows/
|       `-- deploy.yml
|-- docs/
|   `-- entregable-3.md
|-- frontend/
|   `-- index.html
|-- lambda/
|   `-- espacios/
|       `-- index.js
`-- README.md
```

Esta organizacion separa claramente la capa de presentacion, la logica serverless, la automatizacion del despliegue y la documentacion del proyecto.

## 4. Repositorio Git

Se creo un repositorio Git para versionar el desarrollo del entregable y se publico en GitHub para mantener un historial de cambios, facilitar el respaldo del proyecto y servir como fuente del pipeline CI/CD.

Repositorio remoto:

- GitHub: `https://github.com/Kio0831/sistema-serverless-reservacion-campus`

## 5. Sitio estatico en Amazon S3

Se preparo un frontend minimo en `frontend/index.html` para consumir el endpoint `GET /espacios`. El objetivo de este sitio es ofrecer una prueba simple de integracion entre la capa web y la capa serverless del sistema.

La pagina permite:

- capturar la URL del endpoint publicado en API Gateway
- ejecutar una solicitud HTTP GET
- mostrar en pantalla la respuesta JSON recibida

El bucket definido para el despliegue del frontend es:

- `kio0831-reservacion-campus-frontend`

Region seleccionada para la infraestructura:

- `us-east-2` (US East - Ohio)

## 6. Primera funcion Lambda

Se desarrollo una funcion Lambda en Node.js ubicada en `lambda/espacios/index.js`. Esta funcion simula una consulta de espacios del campus y devuelve un conjunto fijo de datos con fines de validacion tecnica.

La respuesta de la Lambda incluye:

- un mensaje de exito
- el total de espacios devueltos
- un arreglo con espacios simulados y su disponibilidad

Adicionalmente, la funcion devuelve encabezados CORS para permitir que el frontend pueda consumir la API desde el navegador.

## 7. Primer endpoint en API Gateway

El siguiente paso de la arquitectura consiste en publicar el endpoint `GET /espacios` en Amazon API Gateway y vincularlo directamente con la Lambda creada. Esto permitira exponer una URL publica para pruebas desde navegador, Postman y el frontend desplegado en S3.

## 8. Pipeline CI/CD basico

Se definio un workflow en GitHub Actions llamado `deploy.yml`. Su proposito es desplegar automaticamente el contenido de `frontend/` al bucket S3 cuando se hagan cambios en la rama `main`.

El workflow requiere la configuracion de los siguientes secrets en GitHub:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET_NAME`

## 9. Evidencia requerida

Para demostrar el cumplimiento del entregable se planea reunir la siguiente evidencia:

- captura del repositorio en GitHub
- captura del bucket S3 y del sitio estatico
- captura de la configuracion de la funcion Lambda
- captura de la configuracion del endpoint en API Gateway
- captura de la respuesta correcta del endpoint en el navegador o Postman
- captura del frontend mostrando el JSON recibido

## 10. Resultado esperado del endpoint

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
    },
    {
      "id": "LAB2",
      "nombre": "Laboratorio 2",
      "edificio": "Edificio de Ingenieria",
      "capacidad": 25,
      "disponible": false
    },
    {
      "id": "AUD1",
      "nombre": "Auditorio Principal",
      "edificio": "Centro Cultural",
      "capacidad": 120,
      "disponible": true
    }
  ]
}
```

## 11. Estado actual

Al momento de esta version del documento, la base del proyecto ya se encuentra preparada a nivel local y publicada en GitHub. La configuracion en AWS se encuentra en proceso, particularmente en S3, a la espera de permisos suficientes para completar la parte publica del sitio y continuar con Lambda, API Gateway y CI/CD completamente funcional.
