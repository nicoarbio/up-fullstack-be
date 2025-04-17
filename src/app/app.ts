import express, { Express } from "express";
import bodyParser from "body-parser";

import "@config/log4js.config";

import setupHealthCheck from "@config/health-check";
import setupSwagger from "@config/swagger.config";

import { extractAuthorizationHeader } from "@middleware/authentication.middleware";
import { withRequestContext } from "@middleware/request-context.middleware";

import { API_BASE_URL } from "@config/config.properties";

import authenticationRouter from "@route/authentication.routes";
import bookingsRouter from "@route/bookings.routes";
import paymentRouter from "@route/payment.routes";
import profileRouter from "@route/profile.routes";
import servicesRouter from "@route/services.routes";
import debugRouter from "@route/debug.routes";

const app: Express = express();

app.set('trust proxy', true);

setupHealthCheck(app);

//if (!IS_PROD) setupSwagger(app);
setupSwagger(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(extractAuthorizationHeader);
app.use(withRequestContext);

app.use(`${ API_BASE_URL }`, authenticationRouter);
app.use(`${ API_BASE_URL }`, bookingsRouter);
app.use(`${ API_BASE_URL }`, paymentRouter);
app.use(`${ API_BASE_URL }`, profileRouter);
app.use(`${ API_BASE_URL }`, servicesRouter);
app.use(`${ API_BASE_URL }/debug`, debugRouter);

export default app;
