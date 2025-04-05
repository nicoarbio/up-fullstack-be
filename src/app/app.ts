import express, { Express } from "express";
import bodyParser from "body-parser";

import { API_BASE_URL } from "./config/config.properties.js";

import authenticationRouter from "./routes/authentication.routes.js";
import bookingsRouter from "./routes/bookings.routes.js";
import cartRouter from "./routes/cart.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import profileRouter from "./routes/profile.routes.js";
import servicesRouter from "./routes/services.routes.js";

import setupSwagger from "./config/swagger.config.js";

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(`${API_BASE_URL}`, authenticationRouter);
app.use(`${API_BASE_URL}`, bookingsRouter);
app.use(`${API_BASE_URL}`, cartRouter);
app.use(`${API_BASE_URL}`, paymentRouter);
app.use(`${API_BASE_URL}`, profileRouter);
app.use(`${API_BASE_URL}`, servicesRouter);

setupSwagger(app);

export default app;
