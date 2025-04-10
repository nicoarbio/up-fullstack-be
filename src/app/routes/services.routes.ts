import { Router } from "express";
import { query } from 'express-validator';
import { getServicesAvailability } from "../controller/services.controller.js";
import { Product } from "../model/enum/booking.enum.js";

const servicesAvailabilityValidation= [
    query('date')
        .isISO8601()
        .withMessage('La fecha debe estar en formato YYYY-MM-DD'),
    query('products')
        .customSanitizer((value) => Array.isArray(value) ? value : [value])
        .custom((products) => {
            const allowed = Object.values(Product).map(String);
            return products.every((p: string) => allowed.includes(p));
        })
        .withMessage('Uno o más productos no son válidos')
    ]

export default Router()
    .get("/services/availability", servicesAvailabilityValidation, getServicesAvailability);
