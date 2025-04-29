# Proyecto Integrador - Fullstack Web Development - Backend

> [!TIP]
> Ver la [consigna](./consigna.md) del Trabajo Práctico Integrador.
>
> Ver [desarrollo y preguntas](./desarrollo-y-preguntas.md) de la consigna.

## ENTREGA BACKEND - Como levantar la aplicación
1. Clonar el repositorio
2. Instalar las dependencias
  ```bash
  npm install
  ```
3. Crear un archivo `.env` en la raíz del proyecto y agregar las variables de entorno necesarias (ver `.env_sample`)
4. Utilizar el comando `npm run dev` para iniciar el servicio.
5. Generar llaves RSA para la encriptación de la password (ver [Encriptar el texto plano de la password](#encriptar-el-texto-plano-de-la-password)) y dejarlas en la raíz del proyecto.

> Para un entorno de producción se recomienda usar:
>
> Build command: `npm run build`
>
> Start command: `npm run start`

## Uso de la API - Endpoints
| Grupo                | HTTP Action | Path                                             | Uso |
|----------------------|-------------|--------------------------------------------------|-----|
| Encriptación Debug   | GET         | /api/v1/debug/auth/encrypt/rsa                  | Permite encriptar utilizando la clave RSA pública el texto plano de la contraseña ya sea para registro como para iniciar sesión |
| Encriptación Debug   | GET         | /api/v1/debug/auth/decrypt/rsa                  | Permite comprobar, usando la clave RSA privada, que el circuito funciona |
| Encriptación Debug   | GET         | /api/v1/debug/auth/encrypt/bcrypt               | Permite hashear usando bcrypt un texto plano (contraseña) que se almacenará en la base de datos |
| Autenticación        | POST        | /api/v1/auth/signup                             | Dado un email y contraseña (encriptada RSA) genera un usuario NO admin |
| Autenticación        | POST        | /api/v1/auth/login                              | Permite iniciar sesión utilizando email y contraseña. Devuelve dos JWT: accessToken y refreshToken |
| Autenticación        | POST        | /api/v1/auth/refresh                            | Permite refrescar el accessToken a partir del refreshToken |
| Autenticación        | POST        | /api/v1/oauth/google                            | Permite registrarse/iniciar sesión utilizando una cuenta de Google. También devuelve ambos JWT. Herramienta para obtener JWT: [get-googlejwt-from-clientid](https://nicoarbio.github.io/get-googlejwt-from-clientid/?clientId={}) |
| Autenticación Debug  | GET         | /api/v1/debug/auth                              | Verifica que el accessToken en el header es válido |
| Autenticación Debug  | GET         | /api/v1/debug/auth/admin                        | Verifica que solo puede acceder un ADMIN logueado |
| Autenticación Debug  | GET         | /api/v1/debug/auth/user                         | Verifica que solo puede acceder un USER logueado |
| Perfil de usuario    | GET         | /api/v1/profile                                 | Permite obtener los datos del usuario logueado |
| Perfil de usuario    | PUT         | /api/v1/profile                                 | Permite modificar nombre, apellido y/o número de teléfono |
| Disponibilidad       | GET         | /api/v1/services/availability                   | Dada una fecha y productos, devuelve los slots con su disponibilidad. Si no hay stock, el slot aparecerá vacío |
| Turnos               | GET         | /api/v1/bookings                                | Devuelve los bookings del usuario autenticado o todos si es admin. Soporta paginación y ordenamiento |
| Orden                | POST        | /api/v1/order/validate                          | Dado el payload de reserva (producto, timestamp, pasajeros), valida el stock y calcula extras, descuentos y precios |
| Orden                | POST        | /api/v1/order/create                            | Usa el mismo payload de validación para crear la orden y bookings asociados |
| Orden                | GET         | /api/v1/order/{id}                              | Devuelve la orden por ID si pertenece al usuario o si es admin |
| Pago                 | POST        | /api/v1/payment/cash                            | Registra un pago en efectivo para una orden. Soporta conversión USD/ARS vía API externa |
| Pago                 | GET         | /api/v1/payment/{id}                            | Obtiene los datos de un pago por ID |
| Reembolso            | POST        | /api/v1/refund                                  | Usuario solicita reembolso de un turno, indicando motivo |
| Reembolso            | GET         | /api/v1/refund/{id}                             | Devuelve los datos de un reembolso por ID |
| Reembolso            | POST        | /api/v1/refund/storm                            | Permite a un ADMIN reembolsar automáticamente una orden con seguro de tormenta |
| Reembolso            | POST        | /api/v1/refund/{id}/register-cash              | Registra manualmente el acto de reembolso en efectivo al cliente |

### Propuesta de uso:
1. Registrar un usuario (POST /api/v1/auth/signup)
2. Iniciar sesión (POST /api/v1/auth/login)
3. Obtener disponibilidad para una fecha válida (POST /api/v1/services/availability)
4. Realizar una orden (POST /api/v1/order/create)
5. Registrar un pago (POST /api/v1/payment/cash)
6. Consultar el booking (GET /api/v1/bookings)
7. Consultar la orden (GET /api/v1/order/{id})
8. Consultar el pago (GET /api/v1/payment/{id})
9. Solicitar reembolso (POST /api/v1/refund)
10. Consultar el reembolso (GET /api/v1/refund/{id})
11. Registrar pago de reeembolso (POST /api/v1/refund/{id}/register-cash)

### Pendiente
- [ ] Implementar cron que verifique cada 30 minutos que las reservas activas impagas que tienen menos de dos horas para que comiencen, se den por vencidas  


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
