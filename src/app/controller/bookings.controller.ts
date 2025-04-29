import { Request, Response } from "express";
import { BookingQuery, getBookingsByDate } from "@service/bookings.service";
import { DateTime } from "luxon";

export async function getBookings(req: Request, res: Response) {
    const bookingQuery: BookingQuery = {
        searchDate: DateTime.fromISO(req.query.searchDate as string),
        page: parseInt(req.query.page as string),
        limit: parseInt(req.query.limit as string),
        sortBy: req.query.sortBy as string,
        order: req.query.order as string,
        user: req.user
    }
    await getBookingsByDate(bookingQuery)
        .then(bookings => res.status(200).json(bookings))
        .catch(error => {
            res.status(500).json({ error: error.message, detail: error.cause });
            console.error('Error retrieving bookings:', error.message || error);
        })
}

export async function deleteBooking(req: Request, res: Response) {
    res.status(501).json({ message: "Not implemented" });
}
