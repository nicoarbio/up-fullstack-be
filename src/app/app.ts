import express, { Express } from "express";
import bodyParser from "body-parser";

import { API_BASE_URL } from "./config/config.properties.js";

import authenticationRouter from "./controller/authentication.js";
import bookingsRouter from "./controller/bookings.js";
import cartRouter from "./controller/cart.js";
import paymentRouter from "./controller/payment.js";
import profileRouter from "./controller/profile.js";
import servicesRouter from "./controller/services.js";

import setupSwagger from "./config/swagger/swagger.config.js";

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
