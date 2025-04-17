import { Router } from "express";
import { deleteBooking, getBookings } from "@controller/bookings.controller";
import { authenticate } from "@middleware/authentication.middleware";
import { query } from "express-validator";
import { withValidation } from "@middleware/validateRequest.middleware";
import { DateTime } from "luxon";

const getBookingsValidation = [
    query('searchDate')
        .customSanitizer(date => DateTime.fromISO(date).startOf('day'))
        .custom((date: DateTime) => {
            if (!date.isValid) {
                throw new Error('La fecha debe estar en formato ISO válido');
            }
            return true;
        })
]

export default Router()
    .get("/bookings", authenticate, withValidation(getBookingsValidation), getBookings)
    .delete("/bookings/:bookingId", authenticate, deleteBooking);
