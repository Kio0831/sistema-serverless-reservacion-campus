# Sistema Serverless de Reservacion de Espacios en Campus

Proyecto universitario orientado a construir una solucion serverless en AWS para la consulta y administracion de espacios y eventos del campus.

## Estado actual

El proyecto ya cuenta con:

1. Repositorio Git y publicacion en GitHub.
2. Sitio estatico desplegado en Amazon S3.
3. Lambda y API Gateway base para consulta de espacios.
4. Pipeline CI/CD basico con GitHub Actions.
5. Base local preparada para Entregable 4 con persistencia y CRUD.

## Estructura del proyecto

```text
.
|-- .github/
|   `-- workflows/
|       `-- deploy.yml
|-- docs/
|   |-- checklist-evidencias.md
|   |-- entregable-3.md
|   |-- entregable-4.md
|   `-- entregable-5.md
|-- frontend/
|   `-- index.html
|-- lambda/
|   |-- espacios/
|   |   `-- index.js
|   |-- espaciosCrud/
|   |   `-- index.mjs
|   |-- eventosCrud/
|   |   `-- index.mjs
|   |-- reservacionesService/
|   |   `-- index.mjs
|   `-- registrosService/
|       `-- index.mjs
|-- sql/
|   `-- schema-entrega-4.sql
|-- package.json
`-- README.md
```

## Dependencias backend

Para la conexion a MySQL desde Lambda se usa el paquete `mysql2`.

Instalacion local:

```powershell
npm install
```

## Variables de entorno necesarias para Entregable 4

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

## CRUD objetivo para espacios

- `GET /espacios`
- `GET /espacios/{id}`
- `POST /espacios`
- `PUT /espacios/{id}`
- `DELETE /espacios/{id}`

## CRUD objetivo para eventos

- `GET /eventos`
- `GET /eventos/{id}`
- `POST /eventos`
- `PUT /eventos/{id}`
- `DELETE /eventos/{id}`

## Siguiente etapa

La siguiente etapa del proyecto consiste en conectar las Lambdas `espaciosCrud` y `eventosCrud` con la base `proyectofinal`, crear las tablas base y validar ambos CRUD con Postman.


## Entrega 5

La carpeta local ya incluye dos servicios transaccionales preparados para despliegue:

- POST /reservaciones, GET /reservaciones, PATCH /reservaciones/{id}/cancelar`n- POST /registros, GET /registros, GET /eventos/{eventoId}/registros, GET /usuarios/{usuarioId}/eventos, PATCH /registros/{id}/cancelar`n
