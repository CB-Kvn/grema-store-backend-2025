# Documentación de Endpoints de Google

## Descripción General

Los endpoints de Google permiten gestionar usuarios autenticados con Google OAuth. Incluyen funcionalidades para crear, actualizar, buscar y eliminar usuarios de Google.

## Base URL

```
/api/google
```

## Endpoints Disponibles

### 1. Crear Usuario de Google

**POST** `/api/google/users`

Crea un nuevo usuario de Google en la base de datos.

**Body:**
```json
{
  "googleId": "string (requerido)",
  "email": "string (requerido, formato email)",
  "name": "string (requerido)",
  "avatar": "string (opcional, URL válida)",
  "typeUser": "BUYER | ADMIN (opcional, default: BUYER)",
  "discounts": ["string"] (opcional, array de strings)
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Usuario de Google creado exitosamente",
  "data": {
    "id": "uuid",
    "googleId": "string",
    "email": "string",
    "name": "string",
    "avatar": "string",
    "typeUser": "BUYER",
    "discounts": ["string"],
    "createdAt": "datetime"
  }
}
```

### 2. Buscar o Crear Usuario de Google

**POST** `/api/google/users/find-or-create`

Busca un usuario de Google existente o crea uno nuevo si no existe. Útil para autenticación.

**Body:**
```json
{
  "googleId": "string (requerido)",
  "email": "string (requerido, formato email)",
  "name": "string (requerido)",
  "avatar": "string (opcional, URL válida)",
  "typeUser": "BUYER | ADMIN (opcional, default: BUYER)",
  "discounts": ["string"] (opcional, array de strings)
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuario de Google procesado exitosamente",
  "data": {
    "id": "uuid",
    "googleId": "string",
    "email": "string",
    "name": "string",
    "avatar": "string",
    "typeUser": "BUYER",
    "discounts": ["string"],
    "createdAt": "datetime"
  }
}
```

### 3. Obtener Todos los Usuarios de Google

**GET** `/api/google/users`

**Autenticación:** Requerida

Obtiene todos los usuarios de Google registrados.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "googleId": "string",
      "email": "string",
      "name": "string",
      "avatar": "string",
      "typeUser": "BUYER",
      "discounts": ["string"],
      "createdAt": "datetime"
    }
  ],
  "count": 1
}
```

### 4. Obtener Usuario de Google por ID

**GET** `/api/google/users/:id`

**Autenticación:** Requerida

Obtiene un usuario de Google específico por su ID.

**Parámetros:**
- `id`: UUID del usuario

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "googleId": "string",
    "email": "string",
    "name": "string",
    "avatar": "string",
    "typeUser": "BUYER",
    "discounts": ["string"],
    "createdAt": "datetime"
  }
}
```

### 5. Obtener Usuario de Google por Google ID

**GET** `/api/google/users/google-id/:googleId`

**Autenticación:** Requerida

Obtiene un usuario de Google específico por su Google ID.

**Parámetros:**
- `googleId`: ID de Google del usuario

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "googleId": "string",
    "email": "string",
    "name": "string",
    "avatar": "string",
    "typeUser": "BUYER",
    "discounts": ["string"],
    "createdAt": "datetime"
  }
}
```

### 6. Obtener Usuario de Google por Email

**GET** `/api/google/users/email/:email`

**Autenticación:** Requerida

Obtiene un usuario de Google específico por su email.

**Parámetros:**
- `email`: Email del usuario

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "googleId": "string",
    "email": "string",
    "name": "string",
    "avatar": "string",
    "typeUser": "BUYER",
    "discounts": ["string"],
    "createdAt": "datetime"
  }
}
```

### 7. Actualizar Usuario de Google

**PUT** `/api/google/users/:id`

**Autenticación:** Requerida

Actualiza un usuario de Google existente.

**Parámetros:**
- `id`: UUID del usuario

**Body:**
```json
{
  "googleId": "string (opcional)",
  "email": "string (opcional, formato email)",
  "name": "string (opcional)",
  "avatar": "string (opcional, URL válida)",
  "typeUser": "BUYER | ADMIN (opcional)",
  "discounts": ["string"] (opcional, array de strings)
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuario de Google actualizado exitosamente",
  "data": {
    "id": "uuid",
    "googleId": "string",
    "email": "string",
    "name": "string",
    "avatar": "string",
    "typeUser": "BUYER",
    "discounts": ["string"],
    "createdAt": "datetime"
  }
}
```

### 8. Eliminar Usuario de Google

**DELETE** `/api/google/users/:id`

**Autenticación:** Requerida

Elimina un usuario de Google de la base de datos.

**Parámetros:**
- `id`: UUID del usuario

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuario de Google eliminado exitosamente",
  "data": {
    "id": "uuid",
    "googleId": "string",
    "email": "string",
    "name": "string",
    "avatar": "string",
    "typeUser": "BUYER",
    "discounts": ["string"],
    "createdAt": "datetime"
  }
}
```

## Códigos de Estado HTTP

- **200**: Operación exitosa
- **201**: Recurso creado exitosamente
- **400**: Datos de entrada inválidos
- **401**: No autorizado
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

## Validaciones

### Campos Requeridos para Crear:
- `googleId`: Debe ser una cadena no vacía
- `email`: Debe tener formato de email válido
- `name`: Debe ser una cadena no vacía

### Campos Opcionales:
- `avatar`: Debe ser una URL válida si se proporciona
- `typeUser`: Debe ser 'BUYER' o 'ADMIN' (default: 'BUYER')
- `discounts`: Debe ser un array de strings si se proporciona

### Validaciones de Parámetros:
- `id`: Debe ser un UUID válido
- `email`: Debe tener formato de email válido
- `googleId`: Debe ser una cadena no vacía

## Manejo de Errores

Todos los endpoints devuelven errores en el siguiente formato:

```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [
    {
      "field": "nombre_del_campo",
      "message": "Mensaje de error específico"
    }
  ]
}
```

## Ejemplos de Uso

### Crear un nuevo usuario de Google:
```bash
curl -X POST http://localhost:8080/api/google/users \
  -H "Content-Type: application/json" \
  -d '{
    "googleId": "123456789",
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "avatar": "https://example.com/avatar.jpg",
    "typeUser": "BUYER"
  }'
```

### Buscar o crear usuario (para autenticación):
```bash
curl -X POST http://localhost:8080/api/google/users/find-or-create \
  -H "Content-Type: application/json" \
  -d '{
    "googleId": "123456789",
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "avatar": "https://example.com/avatar.jpg"
  }'
```

### Obtener usuario por ID:
```bash
curl -X GET http://localhost:8080/api/google/users/uuid-del-usuario \
  -H "Authorization: Bearer tu-token-jwt"
```
