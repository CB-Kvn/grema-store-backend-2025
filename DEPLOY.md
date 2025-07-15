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
   - **Build Command**: `npm install && npm run build && npm run prisma:migrate:prod`
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Node Version**: 18+

   <!-- npx prisma generate && npx prisma migrate deploy && npm run server:dev -->

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

### 7. Monitoreo

- Usa los logs de Render para monitorear errores
- Configura alertas para errores críticos
- El endpoint `/api/health` puede usarse para health checks

## Comandos Útiles

```bash
# Desarrollo
npm run server:dev

# Build para producción
npm run build

# Iniciar en producción
npm start

# Generar cliente Prisma
npm run prisma:generate

# Migrar base de datos en producción
npm run prisma:migrate:prod
```
