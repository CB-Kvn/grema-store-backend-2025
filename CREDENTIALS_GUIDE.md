# Guía de Configuración de Credenciales para Producción

## 🚨 IMPORTANTE: Separación de Ambientes

Las credenciales de desarrollo y producción han sido separadas por seguridad. Antes de desplegar en producción, debes configurar las siguientes credenciales:

## 📋 Credenciales que debes obtener para PRODUCCIÓN:

### 1. WhatsApp Business API
```
WHATSAPP_ACCESS_TOKEN=PROD_TOKEN_AQUI
WHATSAPP_PHONE_NUMBER_ID=PROD_PHONE_ID_AQUI
WHATSAPP_WEBHOOK_TOKEN=PROD_WEBHOOK_TOKEN_AQUI
```
- **Dónde obtener**: [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- **Recomendación**: Usa una cuenta de WhatsApp Business diferente para producción

### 2. Cloudinary
```
CLOUDINARY_CLOUD_NAME=dskeh6ivy-prod
CLOUDINARY_API_KEY=PROD_CLOUDINARY_KEY_AQUI
CLOUDINARY_API_SECRET=PROD_CLOUDINARY_SECRET_AQUI
```
- **Dónde obtener**: [Cloudinary Dashboard](https://cloudinary.com/console)
- **Recomendación**: Crea un cloud separado para producción

### 3. ImageKit (Pictures)
```
IMAGEKIT_PUBLIC_KEY_PICS=PROD_IMAGEKIT_PUBLIC_KEY_PICS_AQUI
IMAGEKIT_PRIVATE_KEY_PICS=PROD_IMAGEKIT_PRIVATE_KEY_PICS_AQUI
IMAGEKIT_URL_ENDPOINT_PICS=https://ik.imagekit.io/prod-pics
```

### 4. ImageKit (Others)
```
IMAGEKIT_PUBLIC_KEY_OTHERS=PROD_IMAGEKIT_PUBLIC_KEY_OTHERS_AQUI
IMAGEKIT_PRIVATE_KEY_OTHERS=PROD_IMAGEKIT_PRIVATE_KEY_OTHERS_AQUI
IMAGEKIT_URL_ENDPOINT_OTHERS=https://ik.imagekit.io/prod-others
```
- **Dónde obtener**: [ImageKit Dashboard](https://imagekit.io/dashboard)
- **Recomendación**: Crea proyectos separados para producción

### 5. Google OAuth
```
GOOGLE_CLIENT_ID=PROD_GOOGLE_CLIENT_ID_AQUI
GOOGLE_CLIENT_SECRET=PROD_GOOGLE_CLIENT_SECRET_AQUI
```
- **Dónde obtener**: [Google Cloud Console](https://console.cloud.google.com/)
- **Recomendación**: Crea un proyecto separado para producción

## 🔧 Configuración en Render

### Opción 1: Variables de Entorno en Dashboard
1. Ve a tu service en Render
2. Sección "Environment"
3. Agrega cada variable manualmente

### Opción 2: Actualizar render.yaml
1. Reemplaza los placeholders en `render.yaml`
2. Commit y push al repositorio

## 🎯 Configuraciones Específicas por Ambiente

### Desarrollo (dev.env)
- **Puerto**: 3000
- **CORS**: http://localhost:5173
- **Log Level**: debug
- **WhatsApp API**: v22.0 (más reciente para testing)
- **Cloudinary**: dskeh6ivy-dev

### Producción (prod.env)
- **Puerto**: 8080
- **CORS**: https://tudominio.com
- **Log Level**: warn
- **WhatsApp API**: v19.0 (más estable para producción)
- **Cloudinary**: dskeh6ivy-prod

## ⚡ Pasos para Desplegar

1. **Obtén todas las credenciales de producción**
2. **Actualiza el archivo `prod.env`** con las credenciales reales
3. **Configura las variables en Render** (dashboard o render.yaml)
4. **Actualiza `FRONTEND_URL` y `CORS_ORIGIN`** con tu dominio real
5. **Despliega en Render**

## 🔒 Mejores Prácticas de Seguridad

- ✅ **Nunca** uses credenciales de producción en desarrollo
- ✅ **Nunca** commites credenciales reales al repositorio
- ✅ Usa servicios diferentes para desarrollo y producción
- ✅ Rotación regular de tokens y secrets
- ✅ Monitorea el uso de APIs en producción

## 🚨 Antes de Desplegar

- [ ] Todas las credenciales de producción están configuradas
- [ ] El dominio frontend está correctamente configurado
- [ ] Las cuentas de servicios externos están en modo producción
- [ ] Los webhooks apuntan a la URL de producción
- [ ] Las cuotas y límites de APIs están configurados para producción
