import { Router } from "express";
import { query } from "express-validator";
import { DateTime } from "luxon";
import { getServicesAvailability } from "@controller/services.controller";
import { Product } from "@enum/booking.enum";

const servicesAvailabilityValidation = [
    query('date')
        .custom(value => {
            const inputDate = DateTime.fromISO(value);
            if (!inputDate.isValid) {
                throw new Error('La fecha debe estar en formato ISO válido');
            }
            const now = DateTime.now().minus( { seconds: 5 } );
            const in48Hours = now.plus({ hours: 48 });

            if (!inputDate.isValid) {
                throw new Error('La fecha no es válida');
            }

            if (inputDate < now) {
                throw new Error('La fecha no puede ser menor a la fecha y hora actual');
            }

            if (inputDate > in48Hours) {
                throw new Error('La fecha no puede ser mayor a 48 horas desde ahora');
            }

            return true;
        }),
    query('products')
        .notEmpty()
        .customSanitizer(value => Array.isArray(value) ? value : [ value ])
        .custom(products => {
            const allowed = Object.values(Product).map(String);
            return products.every((p: string) => allowed.includes(p));
        })
        .withMessage('Uno o más productos no son válidos')
]

export default Router()
    .get("/services/availability", servicesAvailabilityValidation, getServicesAvailability);
