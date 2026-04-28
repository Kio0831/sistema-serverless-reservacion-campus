# Entregable 4: Persistencia y CRUD

## Objetivo

Integrar el backend del proyecto con una base de datos real para pasar de una Lambda con datos simulados a un backend con persistencia y operaciones CRUD funcionales.

## Entregables solicitados

1. Base de datos conectada al backend.
2. Conexión Lambda -> base de datos.
3. CRUD del catalogo funcionando.
4. Evidencia con pruebas de API en Postman.
5. Proyecto A: espacios.
6. Proyecto B: eventos.

## Base asignada

Para esta entrega se trabajara con la base institucional asignada `proyectofinal`, identificada en AWS RDS como una instancia `MySQL Community` en la region `us-east-2`.

## Modelo de datos inicial

### Tabla `espacios`

- `id`
- `nombre`
- `edificio`
- `capacidad`
- `disponible`
- `created_at`

### Tabla `eventos`

- `id`
- `titulo`
- `fecha`
- `espacio_id`
- `responsable`
- `descripcion`
- `created_at`

## Variables de entorno esperadas en Lambda

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

## CRUD esperado para espacios

- `GET /espacios`
- `GET /espacios/{id}`
- `POST /espacios`
- `PUT /espacios/{id}`
- `DELETE /espacios/{id}`

## CRUD esperado para eventos

- `GET /eventos`
- `GET /eventos/{id}`
- `POST /eventos`
- `PUT /eventos/{id}`
- `DELETE /eventos/{id}`

## Evidencia esperada

- Captura de la base en RDS.
- Captura de la Lambda conectada a la base.
- Capturas de Postman para GET, POST, PUT y DELETE de `espacios`.
- Capturas de Postman para GET, POST, PUT y DELETE de `eventos`.
- Evidencia del catalogo persistiendo cambios reales.

