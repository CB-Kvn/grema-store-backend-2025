# Banner API Endpoints

Este documento describe todos los endpoints disponibles para la gestión de banners en el sistema.

## Base URL
```
/api/banners
```

## Endpoints Públicos

### 1. Obtener Banners Activos
**GET** `/api/banners/active`

**Descripción:** Obtiene todos los banners con status "ACTIVE" y que estén dentro del rango de fechas válido.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Banner Promocional",
      "dateInit": "2025-01-01T00:00:00.000Z",
      "dateEnd": "2025-12-31T23:59:59.000Z",
      "imageUrl": "https://example.com/imagen-vertical.jpg",
      "status": "ACTIVE",
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

## Endpoints Protegidos (Requieren Autenticación)

### 2. Obtener Todos los Banners
**GET** `/api/banners`

**Descripción:** Obtiene todos los banners del sistema.

**Headers requeridos:**
```
Authorization: Bearer <token>
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Banner Promocional",
      "dateInit": "2025-01-01T00:00:00.000Z",
      "dateEnd": "2025-12-31T23:59:59.000Z",
      "imageUrl": "https://example.com/imagen-vertical.jpg",
      "status": "ACTIVE",
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

### 3. Obtener Banner por ID
**GET** `/api/banners/:id`

**Descripción:** Obtiene un banner específico por su ID.

**Parámetros:**
- `id` (string): ID del banner

**Headers requeridos:**
```
Authorization: Bearer <token>
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Banner Promocional",
    "dateInit": "2025-01-01T00:00:00.000Z",
    "dateEnd": "2025-12-31T23:59:59.000Z",
    "imageUrl": "https://example.com/imagen-vertical.jpg",
    "status": "ACTIVE",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
}
```

**Respuesta de error (404):**
```json
{
  "success": false,
  "message": "Banner no encontrado"
}
```

### 4. Obtener Banners por Status
**GET** `/api/banners/status/:status`

**Descripción:** Obtiene todos los banners con un status específico.

**Parámetros:**
- `status` (string): Status del banner (ACTIVE, INACTIVE, SCHEDULED)

**Headers requeridos:**
```
Authorization: Bearer <token>
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Banner Promocional",
      "dateInit": "2025-01-01T00:00:00.000Z",
      "dateEnd": "2025-12-31T23:59:59.000Z",
      "url": "https://example.com/promo",
      "status": "ACTIVE",
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

### 5. Crear Nuevo Banner
**POST** `/api/banners`

**Descripción:** Crea un nuevo banner.

**Headers requeridos:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body de la petición:**
```json
{
  "name": "Banner Promocional",
  "dateInit": "2025-01-01T00:00:00.000Z",
  "dateEnd": "2025-12-31T23:59:59.000Z",
  "imageUrl": "https://example.com/imagen-vertical.jpg",
  "status": "ACTIVE"
}
```

**Validaciones:**
- `name`: Requerido, string, mínimo 1 carácter, máximo 255 caracteres
- `dateInit`: Requerido, fecha válida en formato ISO
- `dateEnd`: Requerido, fecha válida en formato ISO, debe ser posterior a dateInit
- `imageUrl`: Requerido, URL válida, máximo 500 caracteres
- `status`: Requerido, debe ser uno de: ACTIVE, INACTIVE, SCHEDULED

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Banner Promocional",
    "dateInit": "2025-01-01T00:00:00.000Z",
    "dateEnd": "2025-12-31T23:59:59.000Z",
    "imageUrl": "https://example.com/imagen-vertical.jpg",
    "status": "ACTIVE",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
}
```

### 6. Actualizar Banner
**PUT** `/api/banners/:id`

**Descripción:** Actualiza un banner existente.

**Parámetros:**
- `id` (string): ID del banner

**Headers requeridos:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body de la petición:**
```json
{
  "name": "Banner Actualizado",
  "dateInit": "2025-01-01T00:00:00.000Z",
  "dateEnd": "2025-12-31T23:59:59.000Z",
  "imageUrl": "https://example.com/imagen-actualizada.jpg",
  "status": "INACTIVE"
}
```

**Validaciones:** (Mismas que en crear banner)

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Banner Actualizado",
    "dateInit": "2025-01-01T00:00:00.000Z",
    "dateEnd": "2025-12-31T23:59:59.000Z",
    "imageUrl": "https://example.com/imagen-actualizada.jpg",
    "status": "INACTIVE",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T12:00:00.000Z"
  }
}
```

### 7. Actualizar Status del Banner
**PATCH** `/api/banners/:id/status`

**Descripción:** Actualiza únicamente el status de un banner.

**Parámetros:**
- `id` (string): ID del banner

**Headers requeridos:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body de la petición:**
```json
{
  "status": "INACTIVE"
}
```

**Validaciones:**
- `status`: Requerido, debe ser uno de: ACTIVE, INACTIVE, SCHEDULED

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Banner Promocional",
    "dateInit": "2025-01-01T00:00:00.000Z",
    "dateEnd": "2025-12-31T23:59:59.000Z",
    "imageUrl": "https://example.com/imagen-vertical.jpg",
    "status": "INACTIVE",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T12:30:00.000Z"
  }
}
```

### 8. Eliminar Banner
**DELETE** `/api/banners/:id`

**Descripción:** Elimina un banner del sistema.

**Parámetros:**
- `id` (string): ID del banner

**Headers requeridos:**
```
Authorization: Bearer <token>
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Banner eliminado exitosamente"
}
```

**Respuesta de error (404):**
```json
{
  "success": false,
  "message": "Banner no encontrado"
}
```

## Códigos de Estado HTTP

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Datos de entrada inválidos
- **401 Unauthorized**: Token de autenticación requerido o inválido
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error interno del servidor

## Ejemplos de Uso con cURL

### Obtener banners activos (público)
```bash
curl -X GET "http://localhost:3000/api/banners/active"
```

### Crear un nuevo banner
```bash
curl -X POST "http://localhost:3000/api/banners" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Banner de Año Nuevo",
    "dateInit": "2025-01-01T00:00:00.000Z",
    "dateEnd": "2025-01-31T23:59:59.000Z",
    "imageUrl": "https://example.com/imagen-ano-nuevo.jpg",
    "status": "ACTIVE"
  }'
```

### Actualizar status de un banner
```bash
curl -X PATCH "http://localhost:3000/api/banners/1/status" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "INACTIVE"}'
```

### Eliminar un banner
```bash
curl -X DELETE "http://localhost:3000/api/banners/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Notas Importantes

1. **Autenticación**: Todos los endpoints excepto `/active` requieren un token de autenticación válido.
2. **Fechas**: Todas las fechas deben estar en formato ISO 8601 (UTC).
3. **Validación de fechas**: La fecha de fin (`dateEnd`) debe ser posterior a la fecha de inicio (`dateInit`).
4. **Status**: Los valores válidos para status son: `ACTIVE`, `INACTIVE`, `SCHEDULED`.
5. **URLs**: Deben ser URLs válidas y completas (incluyendo protocolo http/https).
6. **Límites**: El nombre del banner tiene un límite de 255 caracteres y la URL de la imagen de 500 caracteres.