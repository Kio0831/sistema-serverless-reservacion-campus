# Entregable 5: Servicios transaccionales

## Objetivo

Implementar la logica principal del sistema con reglas de negocio reales, validaciones y persistencia correcta.

## Proyecto A: Servicio de reservaciones

### Endpoint principal

- `POST /reservaciones`

### Reglas de negocio

- validar que el espacio exista
- validar que el espacio este disponible
- evitar traslapes de horario entre reservaciones activas
- impedir que la fecha final sea anterior o igual a la fecha inicial

### Consultas

- `GET /reservaciones`

### Cancelacion

- `PATCH /reservaciones/{id}/cancelar`

### Validaciones de cancelacion

- la reservacion existe
- no estaba cancelada previamente
- la reservacion aun no ha iniciado

## Proyecto B: Servicio de registro de asistentes

### Endpoint principal

- `POST /registros`

### Reglas de negocio

- validar que el evento exista
- validar que el evento este activo
- validar cupo disponible
- evitar registros duplicados por usuario en el mismo evento
- descontar cupo al registrar

### Consultas

- `GET /registros`
- `GET /eventos/{eventoId}/registros`
- `GET /usuarios/{usuarioId}/eventos`

### Cancelacion

- `PATCH /registros/{id}/cancelar`

### Validaciones de cancelacion

- el registro existe
- no estaba cancelado previamente
- el evento aun no ha ocurrido
- el cupo se libera correctamente

## Evidencia esperada

Para cada flujo se debe mostrar:

- endpoint
- metodo HTTP
- request body
- response body
- status code
- evidencia en base de datos antes y despues
- prueba en Postman
