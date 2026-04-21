# Sistema Serverless de Reservacion de Espacios en Campus

Base minima para el Entregable 3: infraestructura base en AWS.

## Estructura

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

## Objetivo del entregable

Implementar una primera version funcional con:

1. Repositorio Git
2. Sitio estatico en Amazon S3
3. Funcion Lambda inicial
4. Endpoint GET `/espacios` en API Gateway
5. CI/CD basico
6. Evidencia del endpoint funcionando

## Lambda esperada

La Lambda devuelve una lista fija de espacios disponibles para validar la integracion entre API Gateway y Lambda.

## Frontend esperado

El frontend hace una solicitud `GET` al endpoint `/espacios` y muestra la respuesta en pantalla.

