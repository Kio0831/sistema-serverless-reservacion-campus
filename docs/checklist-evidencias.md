# Checklist de evidencias - Entregable 3

Usa esta lista para reunir las capturas necesarias del proyecto "Sistema Serverless de Reservacion de Espacios en Campus". La idea es tomar evidencia en el orden correcto y guardar imagenes claras para tu reporte o presentacion.

## Recomendaciones antes de tomar capturas

- Usa siempre la misma region de AWS: `us-east-2`.
- Verifica que el nombre del bucket visible sea `kio0831-reservacion-campus-frontend`.
- Procura que en las capturas se vea la URL, el nombre del recurso o el estado exitoso.
- Si una pantalla contiene datos sensibles, evita mostrar secretos o llaves de acceso.
- Guarda las imagenes con nombres ordenados para identificarlas rapido.

## Orden sugerido de capturas

### 1. Repositorio en GitHub

Captura esperada:

- pagina principal del repositorio en GitHub
- nombre del repositorio visible
- rama `main` visible
- estructura base del proyecto visible

Nombre sugerido del archivo:

- `01-repositorio-github.png`

### 2. Bucket S3 creado

Captura esperada:

- bucket `kio0831-reservacion-campus-frontend`
- region `us-east-2`
- vista general del bucket o listado de buckets

Nombre sugerido del archivo:

- `02-bucket-s3-creado.png`

### 3. Static website hosting configurado

Captura esperada:

- seccion `Static website hosting`
- opcion habilitada
- `index.html` como documento indice
- website endpoint visible si ya aparece

Nombre sugerido del archivo:

- `03-s3-static-website-hosting.png`

### 4. Archivo frontend cargado al bucket

Captura esperada:

- archivo `index.html` visible dentro del bucket
- fecha o evidencia de carga si aparece

Nombre sugerido del archivo:

- `04-s3-archivo-index.png`

### 5. Funcion Lambda creada

Captura esperada:

- nombre de la funcion Lambda
- runtime Node.js visible
- pantalla principal de la Lambda

Nombre sugerido del archivo:

- `05-lambda-creada.png`

### 6. Codigo de la Lambda

Captura esperada:

- editor de codigo mostrando la funcion
- respuesta JSON o parte del arreglo de espacios visible

Nombre sugerido del archivo:

- `06-lambda-codigo.png`

### 7. API Gateway con recurso y metodo

Captura esperada:

- recurso `/espacios`
- metodo `GET`
- relacion con la Lambda visible si es posible

Nombre sugerido del archivo:

- `07-api-gateway-recurso-get.png`

### 8. API desplegada

Captura esperada:

- stage desplegado, por ejemplo `prod`
- invoke URL visible

Nombre sugerido del archivo:

- `08-api-gateway-deploy.png`

### 9. Endpoint funcionando

Captura esperada:

- navegador o Postman mostrando la URL completa
- respuesta JSON con `mensaje`, `total` y `espacios`
- codigo HTTP exitoso si es posible

Nombre sugerido del archivo:

- `09-endpoint-funcionando.png`

### 10. Frontend consumiendo el endpoint

Captura esperada:

- pagina del frontend abierta desde S3
- campo con la URL del endpoint
- respuesta JSON mostrada en pantalla despues de consultar

Nombre sugerido del archivo:

- `10-frontend-consumiendo-endpoint.png`

### 11. GitHub Actions exitoso

Captura esperada:

- workflow `deploy-frontend` o nombre equivalente
- ejecucion completada con exito

Nombre sugerido del archivo:

- `11-github-actions-exitoso.png`

## Evidencia minima indispensable

Si te piden solo lo esencial, prioriza estas capturas:

- repositorio en GitHub
- bucket S3
- Lambda creada
- API Gateway con `GET /espacios`
- endpoint respondiendo JSON
- frontend mostrando la respuesta

## Carpeta sugerida para guardar evidencias

Puedes guardar tus capturas en una carpeta local como esta:

- `C:\Users\ASUS\Documents\Codex\Entregable 3\evidencias`

## Estado de avance

Marca cada punto conforme lo completes:

- [x] Repositorio Git y GitHub
- [x] Documentacion base del entregable
- [ ] Bucket S3 completamente configurado
- [ ] Sitio estatico publico funcionando
- [ ] Lambda creada en AWS
- [ ] API Gateway configurado
- [ ] Endpoint funcionando
- [ ] Frontend conectado con la API
- [ ] CI/CD funcionando en GitHub Actions
- [ ] Evidencias completas recolectadas
