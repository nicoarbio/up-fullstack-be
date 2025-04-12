# Proyecto Integrador - Fullstack Web Development - Backend

> [!TIP]
> Ver la [consigna](./consigna.md) del Trabajo Práctico Integrador
> Ver [desarrollo y preguntas](./desarrollo-y-preguntas.md) de la consigna

## Características y tecnologías

- API RESTful
- Node.js
- Typescript
- Express
- MongoDB (+ mongodb-memory-server para entorno local. Ver [inmemory.connection.ts](src/app/config/mongodb/inmemory.connection.ts))
- Mongoose
- Swagger (ver /docs/swagger/** y [swagger.config.ts](src/app/config/swagger.config.ts))
- Vitest
- Autenticación (via JTW jsonwebtoken)
    - user & password
    - google

> [!NOTE]
> Servicio actualmente deployado en Render: https://up-fullstack-be.onrender.com/api-docs/

## Como levantar la aplicación

1. Clonar el repositorio
2. Instalar las dependencias

  ```bash
  npm install
  ```

3. Crear un archivo `.env` en la raíz del proyecto y agregar las variables de entorno necesarias (ver `.env_sample`)
4. Utilizar el comando `npm run dev` para levantar el servidor en modo desarrollo. (Puede usarse `npm run dev:watch` para refrescar automáticamente ante cambios)

> Para un entorno de producción se recomienda usar:
> Build command: `npm run build`
> Start command: `npm run start`
