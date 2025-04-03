import express from "express";

export default express.Router()
    .get("/bookings", getAllServices)
    .delete("/bookings/:bookingId", deleteBooking);

function getAllServices(req, res) {

}

function deleteBooking(req, res) {

}
