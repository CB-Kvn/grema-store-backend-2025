# Grema Store Backend - Despliegue en Render

## Configuración para Producción

### 1. Preparación del Proyecto

El proyecto ya está configurado con:
- Scripts de build y start para producción
- Configuración de variables de entorno
- Migraciones de base de datos automáticas
- Configuración de CORS diferenciada por ambiente

### 2. Despliegue en Render

#### Opción A: Usando render.yaml (Recomendado)
1. Sube el código a GitHub
2. Conecta tu repositorio en Render
3. Render detectará automáticamente el archivo `render.yaml`
4. El despliegue se ejecutará automáticamente

#### Opción B: Configuración Manual
1. Crea un nuevo Web Service en Render
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Build Command**: `npm ci --include=dev && npm run prisma:generate && npm run build && npm run prisma:migrate:prod`
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Node Version**: 18+

   **⚠️ IMPORTANTE:** 
   - El orden de los comandos es crucial. Prisma debe generarse ANTES de la compilación TypeScript.
   - El flag `--include=dev` es necesario para instalar las dependencias de desarrollo (TypeScript, tipos, etc.) durante el build.

### 3. Variables de Entorno

En el dashboard de Render, configura estas variables:

#### Obligatorias:
- `NODE_ENV=production`
- `PORT=8080`
- `DATABASE_URL=` (Tu URL de PostgreSQL)
- `JWT_SECRET=` (Un secret fuerte)
- `FRONTEND_URL=` (URL de tu frontend)

#### Opcionales (según funcionalidades):
- `WHATSAPP_ACCESS_TOKEN=`
- `WHATSAPP_PHONE_NUMBER_ID=`
- `WHATSAPP_API_VERSION=v19.0`
- `WHATSAPP_WEBHOOK_TOKEN=`
- `CLOUDINARY_CLOUD_NAME=`
- `CLOUDINARY_API_KEY=`
- `CLOUDINARY_API_SECRET=`
- `IMAGEKIT_PUBLIC_KEY=`
- `IMAGEKIT_PRIVATE_KEY=`
- `IMAGEKIT_URL_ENDPOINT=`

### 4. Base de Datos

1. Crea una base de datos PostgreSQL en Render
2. Copia la URL de conexión a la variable `DATABASE_URL`
3. Las migraciones se ejecutarán automáticamente en el build

### 5. Verificación

Después del despliegue:
1. Verifica que el endpoint `/api/health` responda
2. Comprueba los logs en el dashboard de Render
3. Testa la conectividad con tu frontend

### 6. Solución de Problemas

#### Error de Variables de Entorno:
- Verifica que todas las variables estén configuradas
- Asegúrate de que `NODE_ENV=production`

#### Error de Base de Datos:
- Verifica la URL de conexión
- Asegúrate de que la base de datos esté activa

#### Error de Build:
- Revisa los logs de build en Render
- Verifica que todas las dependencias estén en `package.json`
- **Error común**: Si aparecen errores TypeScript relacionados con propiedades de Prisma (como `Images`, `google`, `state`, etc.), asegúrate de que el comando de build incluya `npm run prisma:generate` ANTES de `npm run build`
- **Error "rimraf not found"**: Si aparece este error, significa que hay un problema con el script de limpieza. El proyecto ya está configurado para usar comandos Node.js multiplataforma.
- **Error "Cannot find module 'express'" o tipos Node.js**: Asegúrate de que el build command incluya `--include=dev` para instalar las dependencias de desarrollo necesarias para TypeScript.

#### Error "Cannot find module dist/index.js":
- Verifica que el build se complete correctamente
- Asegúrate de que el archivo `package.json` tenga `"main": "dist/index.js"`
- Confirma que el comando de start sea `npm start` y no tenga rutas incorrectas

### 7. Monitoreo

- Usa los logs de Render para monitorear errores
- Configura alertas para errores críticos
- El endpoint `/api/health` puede usarse para health checks

## Comandos Útiles

```bash
# Desarrollo
npm run server:dev

# Build para producción (orden correcto)
npm run prisma:generate && npm run build

# Iniciar en producción
npm start

# Generar cliente Prisma
npm run prisma:generate

# Migrar base de datos en producción
npm run prisma:migrate:prod

# Limpiar dist y rebuild completo
npm run prebuild && npm run build

# Debug de paths y archivos
npm run start:debug-node
```

## Notas Importantes

### Orden de Comandos en el Build
Es crucial ejecutar los comandos en el siguiente orden:
1. `npm ci --include=dev` - Instalar dependencias incluyendo las de desarrollo (TypeScript, tipos, etc.)
2. `npm run prisma:generate` - Generar cliente Prisma con todos los tipos
3. `npm run build` - Compilar TypeScript (ahora puede encontrar todos los tipos de Prisma)
4. `npm run prisma:migrate:prod` - Aplicar migraciones a la base de datos

**Nota importante**: El flag `--include=dev` es crucial porque necesitamos las dependencias de desarrollo para compilar TypeScript.

### Problemas Comunes y Soluciones

#### Error TypeScript en Build:
Si aparecen errores como "Property 'Images' does not exist" o similares, significa que el cliente Prisma no se generó antes de la compilación TypeScript. Solución: ejecutar `npm run prisma:generate` antes de `npm run build`.

#### Error "Cannot find module" o tipos TypeScript:
Si aparecen errores como "Cannot find module 'express'" o "Cannot find name 'process'", significa que las dependencias de desarrollo no se instalaron. Solución: usar `npm ci --include=dev` o `npm install` en lugar de solo `npm ci`.

#### Error "Cannot find module dist/index.js":
Si el servidor no puede encontrar `dist/index.js`, verifica que:
- El build se completó exitosamente
- El archivo `package.json` tenga `"main": "dist/index.js"`
- El directorio `dist` existe y contiene los archivos compilados

#### Error "rimraf not found":
Si aparece este error durante el build, significa que hay un problema con el script de limpieza del directorio `dist`. El proyecto está configurado para usar comandos Node.js multiplataforma que no dependen de herramientas externas.
