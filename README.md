# Sistema Serverless de Reservacion de Espacios en Campus

Proyecto universitario orientado a construir una primera base serverless en AWS para consultar espacios del campus. Este repositorio corresponde al Entregable 3, enfocado en dejar operativa la infraestructura inicial y documentar la evidencia de funcionamiento.

## Objetivo del Entregable 3

Implementar una primera version funcional con los siguientes elementos:

1. Repositorio Git y publicacion en GitHub.
2. Bucket S3 configurado como sitio web estatico.
3. Primera funcion Lambda en AWS.
4. Primer endpoint `GET /espacios` en API Gateway.
5. Pipeline CI/CD basico con GitHub Actions.
6. Evidencia visual del endpoint funcionando y del frontend consumiendo la API.

## Estructura del proyecto

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

## Descripcion de carpetas

- `frontend/`: contiene el sitio estatico minimo que consume el endpoint publicado en API Gateway.
- `lambda/espacios/`: incluye la funcion Lambda inicial escrita en Node.js.
- `docs/`: almacena la documentacion del entregable y la guia de evidencias.
- `.github/workflows/`: define el pipeline CI/CD para desplegar el frontend al bucket S3.

## Funcion Lambda incluida

La Lambda devuelve una lista fija de espacios disponibles para validar la integracion inicial entre API Gateway y Lambda. La respuesta incluye:

- mensaje de confirmacion
- total de espacios
- arreglo de espacios simulados

## Frontend incluido

El frontend permite pegar la URL del endpoint publicado en API Gateway y realizar una consulta `GET /espacios`. La respuesta JSON se muestra en pantalla para comprobar que la capa web puede comunicarse con la capa serverless.

## Flujo esperado de la solucion

1. El usuario abre el sitio estatico desplegado en S3.
2. El frontend realiza una solicitud HTTP al endpoint de API Gateway.
3. API Gateway invoca la funcion Lambda.
4. Lambda responde con un JSON de espacios simulados.
5. El frontend muestra el resultado recibido.

## Pipeline CI/CD basico

El workflow `deploy.yml` despliega automaticamente el contenido de `frontend/` hacia un bucket S3 cuando hay cambios en la rama `main`.

Secrets esperados en GitHub:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET_NAME`

## Estado actual del entregable

- Repositorio Git inicializado y publicado en GitHub.
- Frontend base creado.
- Lambda base creada.
- Workflow inicial de despliegue creado.
- Configuracion de AWS en proceso.

## Evidencia sugerida para la entrega

- Captura del repositorio en GitHub.
- Captura del bucket S3.
- Captura de la funcion Lambda.
- Captura de la configuracion del endpoint en API Gateway.
- Captura del endpoint respondiendo correctamente.
- Captura del frontend mostrando el JSON recibido.
