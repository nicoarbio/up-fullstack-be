import { Router } from "express";
import { query } from "express-validator";
import { DateTime } from "luxon";
import { getServicesAvailability } from "@controller/services.controller";
import { Product } from "@enum/booking.enum";

const servicesAvailabilityValidation= [
    query('date')
        .isISO8601()
        .withMessage('La fecha debe estar en formato YYYY-MM-DD'),
    query('date')
        .isBefore(DateTime.now().plus({ days: 2 }).toISODate())
        .withMessage('La fecha no puede ser mayor a 2 días'),
    query('date')
        .isAfter(DateTime.now().toISODate())
        .withMessage('La fecha no puede ser menor a la fecha actual'),
    query('products')
        .notEmpty()
        .customSanitizer(value => Array.isArray(value) ? value : [value])
        .custom(products => {
            const allowed = Object.values(Product).map(String);
            return products.every((p: string) => allowed.includes(p));
        })
        .withMessage('Uno o más productos no son válidos')
    ]

export default Router()
    .get("/services/availability", servicesAvailabilityValidation, getServicesAvailability);
