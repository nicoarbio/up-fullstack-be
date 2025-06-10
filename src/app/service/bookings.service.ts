import { DateTime } from "luxon";
import { UserRoles } from "@model/user.model";
import { Booking } from "@model/booking.model";
import { JwtPayload } from "@service/jwt-handler.service";

const allowedSortFields = ['createdAt', 'startTime', 'price', 'status'];
const allowedSortOrders = ['asc', 'desc'];

export type BookingQuery = {
    searchDate: DateTime;
    page: number;
    limit: number;
    sortBy: string;
    order: string;
    user?: JwtPayload
}

export async function getBookingsByDate(bookingQuery: BookingQuery) {
    const query = {
        page: bookingQuery.page || 1,
        limit: bookingQuery.limit || 10,
        sortBy: allowedSortFields.includes(bookingQuery.sortBy) ? bookingQuery.sortBy : allowedSortFields[0],
        order: allowedSortOrders.includes(bookingQuery.order) ? bookingQuery.order : allowedSortOrders[0],
        filter: {
            startTime: {
                $gte: bookingQuery.searchDate.startOf('day'),
                $lte: bookingQuery.searchDate.endOf('day')
            }
        } as any
    };

    if (bookingQuery.user?.role !== UserRoles.ADMIN) query.filter.userId = bookingQuery.user?.id

    const totalBookings = await Booking.countDocuments(query.filter);
    if (!totalBookings) {
        return {
            page: 0,
            limit: query.limit,
            total: totalBookings,
            totalPages: 0,
            sortBy: query.sortBy,
            order: query.order,
            date: bookingQuery.searchDate,
            data: []
        }
    }
    const totalPages = Math.ceil(totalBookings / query.limit);

    query.page = Math.min(query.page, totalPages);

    const bookings = await Booking.find(query.filter)
        .sort({ [query.sortBy]: query.order === 'asc' ? 1 : -1 })
        .skip((query.page - 1) * query.limit)
        .limit(query.limit)
        .select("-__v")
        .populate('userId', 'name lastname')
        .populate('orderId', 'status, extras')
        .lean();

    const bookingsFormatted = bookings.map(b => {
        const user = b.userId as unknown as { _id: string; name: string; lastname: string };
        const order = b.orderId as unknown as { _id: string; status: string, extras: any };

        return {
            ...b,
            userFullName: `${user.name} ${user.lastname}`,
            userId: user._id,
            orderStatus: order.status,
            stormInsurance: order.extras.length > 0
        };
    });

    return {
        page: query.page,
        limit: query.limit,
        total: totalBookings,
        totalPages,
        sortBy: query.sortBy,
        order: query.order,
        date: bookingQuery.searchDate,
        data: bookingsFormatted
    }
}
