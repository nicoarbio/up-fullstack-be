import express, { Express } from "express";
import cors from 'cors';
import bodyParser from "body-parser";

import "@config/log4js.config";

import setupHealthCheck from "@config/health-check";
import setupSwagger from "@config/swagger.config";

import { extractAuthorizationHeader } from "@middleware/authentication.middleware";
import { withRequestContext } from "@middleware/request-context.middleware";

import { API_BASE_URL } from "@config/config.properties";

import authenticationRouter from "@route/authentication.routes";
import bookingsRouter from "@route/bookings.routes";
import orderRouter from "@route/order.routes";
import paymentRouter from "@route/payment.routes";
import profileRouter from "@route/profile.routes";
import refundRouter from "@route/refund.routes";
import servicesRouter from "@route/services.routes";
import debugRouter from "@route/debug.routes";
import businessRulesRoutes from "@route/business-rules.routes";

const app: Express = express();

app.use(cors({
    origin: [ 'http://localhost:4200', 'https://up-fullstack-fe.onrender.com' ],
    credentials: true
}));
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
app.use(`${ API_BASE_URL }`, orderRouter);
app.use(`${ API_BASE_URL }`, paymentRouter);
app.use(`${ API_BASE_URL }`, profileRouter);
app.use(`${ API_BASE_URL }`, refundRouter);
app.use(`${ API_BASE_URL }`, servicesRouter);
app.use(`${ API_BASE_URL }`, businessRulesRoutes);
app.use(`${ API_BASE_URL }/debug`, debugRouter);

export default app;
