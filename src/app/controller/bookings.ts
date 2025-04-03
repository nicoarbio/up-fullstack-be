import express, { Request, Response } from "express";

export default express.Router()
    .get("/bookings", getAllServices)
    .delete("/bookings/:bookingId", deleteBooking);

function getAllServices(req: Request, res: Response) {

}

function deleteBooking(req: Request, res: Response) {

}
