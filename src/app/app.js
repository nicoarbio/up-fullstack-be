import express from "express";
import bodyParser from "body-parser";

import authenticationRouter from "./controller/authentication.js";
import bookingsRouter from "./controller/bookings.js";
import cartRouter from "./controller/cart.js";
import paymentRouter from "./controller/payment.js";
import profileRouter from "./controller/profile.js";
import servicesRouter from "./controller/services.js";

const API_VERSION = `v1`;
const API_PREFIX = `/api/${API_VERSION}`;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(`${API_PREFIX}/authentication`, authenticationRouter);
app.use(`${API_PREFIX}/bookings`, bookingsRouter);
app.use(`${API_PREFIX}/cart`, cartRouter);
app.use(`${API_PREFIX}/payment`, paymentRouter);
app.use(`${API_PREFIX}/profile`, profileRouter);
app.use(`${API_PREFIX}/services`, servicesRouter);

export default app;
