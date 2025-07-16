# Endpoint para Actualizar Price y Cost de Warehouse Items

## Descripción General

Este endpoint permite actualizar únicamente el precio (`price`) y el costo (`cost`) de un item específico en el almacén, sin afectar otros campos como cantidad, ubicación, etc.

## Endpoint

**PUT** `/api/warehouse/items/:itemId/price-cost`

### Parámetros de la URL

- `itemId`: ID único del item del almacén (string, UUID)

### Body de la Petición

```json
{
  "price": 29.99,
  "cost": 15.50
}
```

### Campos Requeridos

- `price`: Número (float) - Precio de venta del producto (debe ser mayor o igual a 0)
- `cost`: Número (float) - Costo del producto (debe ser mayor o igual a 0)

### Validaciones

- `price`: Debe ser un número válido y mayor o igual a 0
- `cost`: Debe ser un número válido y mayor o igual a 0
- `itemId`: Debe ser un UUID válido

### Respuesta Exitosa (200)

```json
{
  "success": true,
  "message": "Price and cost updated successfully",
  "data": {
    "id": "uuid-del-item",
    "productId": 123,
    "warehouseId": "uuid-del-almacen",
    "quantity": 50,
    "minimumStock": 10,
    "location": "A-1-B",
    "price": 29.99,
    "cost": 15.50,
    "status": "IN_STOCK",
    "lastUpdated": "2025-07-15T10:30:00Z",
    "product": {
      "id": 123,
      "name": "Producto Ejemplo",
      "description": "Descripción del producto",
      "sku": "PROD-001"
    },
    "warehouse": {
      "id": "uuid-del-almacen",
      "name": "Almacén Principal",
      "location": "Ciudad"
    }
  }
}
```

### Respuestas de Error

#### 400 - Datos Inválidos

```json
{
  "error": "Price and cost are required",
  "success": false
}
```

```json
{
  "error": "Price and cost must be valid numbers",
  "success": false
}
```

```json
{
  "error": "Price and cost must be positive numbers",
  "success": false
}
```

#### 404 - Item No Encontrado

```json
{
  "error": "Internal server error",
  "success": false,
  "message": "Item not found"
}
```

#### 500 - Error Interno

```json
{
  "error": "Internal server error",
  "success": false,
  "message": "Error message details"
}
```

## Ejemplo de Uso

### Petición

```bash
curl -X PUT http://localhost:3000/api/warehouse/items/550e8400-e29b-41d4-a716-446655440000/price-cost \
  -H "Content-Type: application/json" \
  -d '{
    "price": 29.99,
    "cost": 15.50
  }'
```

### Respuesta

```json
{
  "success": true,
  "message": "Price and cost updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "productId": 123,
    "warehouseId": "660e8400-e29b-41d4-a716-446655440000",
    "quantity": 50,
    "minimumStock": 10,
    "location": "A-1-B",
    "price": 29.99,
    "cost": 15.50,
    "status": "IN_STOCK",
    "lastUpdated": "2025-07-15T10:30:00Z"
  }
}
```

## Casos de Uso

1. **Actualización de Precios por Inflación**: Cuando necesitas actualizar masivamente los precios debido a cambios en la inflación
2. **Corrección de Costos**: Cuando el departamento de compras actualiza los costos de productos
3. **Estrategias de Pricing**: Para ajustar márgenes de ganancia modificando precios y costos
4. **Sincronización con Proveedores**: Actualizar costos basados en nuevas cotizaciones de proveedores

## Notas Importantes

- Este endpoint solo actualiza `price` y `cost`, no afecta la cantidad ni otros campos
- La actualización se registra automáticamente en el campo `lastUpdated`
- El endpoint incluye validaciones para asegurar que los valores sean numéricos y positivos
- Se incluye información completa del producto y almacén en la respuesta
