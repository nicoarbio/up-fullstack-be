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

### Configuraciones varias

### JWT
Los diversos secrets se generaron mediante el comando:
```bash
openssl rand -hex 16
```

### Encriptar el texto plano de la password
Para no enviar el texto plano de la password del front al back y no poderla ver en el log de las devtools, se espera que la password venga encriptada utilziando una clave pública RSA. En el backend (previo al uso de bcrypt para la DB), se utiliza la clave privada para desencriptar el texto. Para ello, se generaron las claves pública y privada mediante el siguiente comando:

```bash
openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private.pem -out public.pem
```
