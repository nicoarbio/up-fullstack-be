import { Router } from "express";
import { deleteBooking, getAllServices } from "../controller/bookings.controller.js";

export default Router()
    .get("/bookings", getAllServices)
    .delete("/bookings/:bookingId", deleteBooking);
