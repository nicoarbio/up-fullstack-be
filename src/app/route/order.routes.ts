import { Router } from "express";
import { body, param, ValidationChain } from "express-validator";
import { withValidation } from "@middleware/validateRequest.middleware";
import { createOrder, getOrder, validateOrder } from "@controller/order.controller";
import { areAllSameDay } from "@utils/datetime.utils";
import { DateTime } from "luxon";
import { Product, ExtraType } from "@enum/business-rules.enum";
import { getBusinessRules } from "@service/business-rules.cache";
import { authenticate } from "@middleware/authentication.middleware";

function isBookingValidationRequestArray(data: any): boolean  {
    return Array.isArray(data) && data.length <= 3 && data.every(item =>
        typeof item === "object" &&
        DateTime.fromISO(item.slotStart).isValid &&
        Object.values(Product).includes(item.product) &&
        (typeof item.passengersAmount === "number" || (
            Array.isArray(item.passengers) &&
            item.passengers.every((passenger: any) =>
                typeof passenger.fullName === "string" &&
                DateTime.fromISO(passenger.birthdate).isValid
            )
        ))
    );
}

function isExtraTypeArray(data: any): data is ExtraType[] {
    return Array.isArray(data) && data.every(item => Object.values(ExtraType).includes(item));
}

const orderValidation: ValidationChain[] = [
    body()
        .custom(async body => {
            // Validar bookings-products-accessories
            if (!isBookingValidationRequestArray(body.requestedBookings)) {
                throw new Error("requestedBookings no tiene el formato esperado de BookingValidationRequest[]");
            }

            // Validar extras
            if (!isExtraTypeArray(body.extraIds)) {
                throw new Error("extraIds no tiene el formato esperado de ExtraType[]");
            }

            // Validar fechas
            const slots: DateTime[] = body.requestedBookings.map((b: { slotStart: string; }) => DateTime.fromISO(b.slotStart));
            if (!areAllSameDay(slots)) {
                throw new Error("Todos los bookings deben ser del mismo día")
            }

            const inputDate = slots[0];
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

            // Validar cantidad de pasajeros por booking
            const businessRules = await getBusinessRules();
            for (const booking of body.requestedBookings) {
                const maxPeople = businessRules?.products?.get(booking.product)?.maxPeople!;
                if (booking.passengersAmount > maxPeople) {
                    throw new Error(`Booking for ${booking.product} exceeds max passengers`);
                }
            }
        })
]

const validateOrderGetter: ValidationChain[] = [
    param("id")
        .exists().isMongoId().withMessage("El ID de la orden es requerido")
]

export default Router()
    .post("/order/validate", withValidation(orderValidation), validateOrder)
    .post("/order/create", authenticate, withValidation(orderValidation), createOrder)
    .get("/order/:id", authenticate, withValidation(validateOrderGetter), getOrder);
