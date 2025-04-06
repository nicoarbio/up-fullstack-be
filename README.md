# Proyecto Integrador - Fullstack Web Development - Backend

> Ver la [consigna](./consigna.md) del Trabajo Práctico Integrador

## Características
- API RESTful
- Node.js
- Express
- Typescript
- MongoDB
- Mongoose
- Swagger
- Vitest

> Servicio actualmente deployado en Render: https://up-fullstack-be.onrender.com/api-docs/

## Como levantar la aplicación
1. Clonar el repositorio
2. Instalar las dependencias
```bash
npm install
```
3. Crear un archivo `.env` en la raíz del proyecto y agregar las variables de entorno necesarias (como `PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_HOST`, `DB_OPTIONS`).
4. Utilizar el comando `npm run dev` para levantar el servidor en modo desarrollo. (Puede usarse `npm run dev:watch` para producción)

> Para un entorno de producción se recomienda usar `npm run start`

### Preguntas
1. Si el cliente compra 3 turnos consecutivos y quiere cancelar 1 hora antes, ¿Se le cancelan los 3 o puede elegir cancelar 1? ¿Qué pasa con el beneficio del 10%?
2. Solo se menciona el pago en efectivo, se disponibiliza el pago con tarjetas débito/crédito y billeteras electrónicas?
3. En caso de que 2 sea sí: Conviene comprar siempre en efectivo. En caso de querer cancelar el turno, uno no se presenta y el turno se libera sin cargo. Sin embargo, en caso de pagar con tarjeta, al querer cancelar el turno, se le devuelve parte de la plata, pues hay un costo de cancelación. Es decir, se perjudica a quien paga con anterioridad, por ende se incentiva el pago en efectivo, es esto correcto?
4. El sistema aplica automáticamente el reintegro del 50% del valor abonado en caso de haber adquirido el seguro de tormenta?

## Desarrollo
- Sistema de gestión de alquiler de productos
- Productos: `JetSky`, `Cuatriciclos`, `Equipo de buceo`, `Tablas de surf (para niños y para adultos)`
- Producto checkout: `Seguro de tormenta`
- Reglas de negocio:
  - Si se elige `Tabla de Surf`:
    -  Capacidad máxima 1
    - `Niño` o `Adulto`
  - Si se elige `JetSky`:
    -  Capacidad máxima 2
    -  1 casco para cada pasajero
    -  1 chaleco salvavidas para cada pasajero
  - Turnos:
    - Tienen fecha y hora (API tiempo - https://github.com/moment/luxon/)
    - Son de 30 minutos
    - Máximo 3 consecutivos por cliente
    - La fecha actual no puede ser mayor a 48h del turno elegido
    - Se puede cancelar sin costo hasta 2 horas antes del turno
  - Pagos:
    - Efectivo en el parador - tiene hasta 2 horas antes de que comience el turno, sino se libera
    - Moneda local
    - Moneda extranjera (API Rest tipo de cambio - https://dolarapi.com/docs/argentina/)
  - Reembolsos:
    - Si ese turno está pago y entre sus productos se encuentra el `Seguro de tormenta`, se le reembolsa 50% del valor abonado.
- Precios (definir monto):
  - JetSky
  - Cuatriciclo
  - Equipo de buceo
  - Tabla de surf niño
  - Tabla de surf adulto
- Reglas de precios:
  -  Si se contrata >= 1 servicio (producto) aplicar un 10% de descuento al total a pagar
- Tarifas (definir monto):
  - Costo de cancelación de turno
  - Seguro de tormenta

## Entidades (DB)
### Producto
```json
{
  "id": "string",
  "name": "string",
  "price": "string"
}
```

### Turno
```json
{
  "id": "string",
  "productid": "string",
  "datetime": "date"
}
```

### Cliente
```json
{
  "id": "string",
  "email": "string",
  "password": "string",
  "googleoauthid": "string"
}
```

### Compra
```json
{
  "id": "string",
  "customerid": "string",
  "datetime": "date",
  "appointmentids": ["string"],
  "status": "string"
}
```

### Calendario
```json
{
  "datetimeStart": "date",
  "datetimeEnd": "date",
  "appointmentid": "string",
  "status": "string"
}
```
