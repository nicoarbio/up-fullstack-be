import { Request, Response } from "express";
import mongoose from "mongoose";
import { DateTime } from "luxon";
import { OrderStatus } from "@enum/order.enum";
import { UserRoles } from "@model/user.model";
import { Currency, PaymentMethod, PaymentStatus } from "@enum/payment.enum";
import { Order } from "@model/order.model";
import { Payment } from "@model/payment.model";
import { Booking } from "@model/booking.model";

export async function processCashPayment(req: Request, res: Response) {
    const { orderId, amount, currency } = req.body as { orderId: string, amount: number, currency: Currency };
    const order = await Order.findById(orderId);

    if (!order) {
        res.status(404).json({ message: "Orden no encontrada" });
        return;
    }

    // todos los startTime de las order.bookings deben estar en al menos 2 horas al futuro
    const now = DateTime.now();
    const twoHoursFromNow = now.plus({ hours: 2 });
    const bookingsIds = order.bookings.map(booking => booking._id);
    const bookings = await Booking.find({ _id: { $in: bookingsIds } });
    const allBookingsInFuture = bookings.every(booking => {
        const bookingStartTime = DateTime.fromJSDate(booking.startTime);
        return bookingStartTime > twoHoursFromNow;
    });

    // Doy la opción de poder realizar el pago si la orden se creó en los ultimos 5 minutos.
    // De otra forma, nunca se podrá pagar si faltan menos de dos horas para el turno
    if (!allBookingsInFuture && DateTime.fromJSDate(order.createdAt) < now.minus({ minutes: 5 })) {
        res.status(400).json({ message: "Todos los turnos deben pagarse al menos 2 horas antes. Esta orden será descartada." });
        return;
    }

    if (order.status !== OrderStatus.PENDING || order.paymentId) {
        res.status(409).json({ message: "Esta orden ya tiene un pago realizado" });
        return;
    }

    if (currency == Currency.USD) {
        const usdArs = await fetch('https://dolarapi.com/v1/dolares')
            .then(response => response.json())
            .then((data: any[]) => {
                const usd = data.find((item: { nombre: string }) => "oficial" === item.nombre.toLowerCase());
                if (!usd) {
                    throw new Error("No se encontró el valor del USD");
                }
                return usd.venta as number;
            })
            .catch(error => {
                res.status(500).json({ message: "Error al convertir USD a ARS", error });
                return;
            });
        const convertedAmount = amount * usdArs!;
        if (order.finalPrice < convertedAmount) {
            res.status(400).json({ message: "El monto no concuerda con el total de la orden" });
            return;
        }
    } else {
        if (order.finalPrice !== amount) {
            res.status(400).json({ message: "El monto no concuerda con el total de la orden" });
            return;
        }
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const payment = await Payment.create({
            userId: order.userId,
            orderId: order._id,
            amount,
            currency,
            method: PaymentMethod.CASH,
            status: PaymentStatus.COMPLETED,
            paidAt: DateTime.now()
        })

        order.paymentId = payment._id;
        order.status = OrderStatus.PAID;

        await order.save();
        await payment.save();

        res.status(201).json(payment);
        console.log(`Payment processed: ${JSON.stringify(payment)}`);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: "Error processing payment", error });
    }
}

export async function getPayment(req: Request, res: Response) {
    const orderId = req.params.id;
    const user = req.user!;
    const query: any = {
        _id: orderId
    };
    if (user.role !== UserRoles.ADMIN) query.userId = user.id;
    const payment = await Payment.findOne(query);
    if (!payment) {
        res.status(404).json({ message: "No se encontró el pago" });
        return;
    }
    res.status(200).json(payment);
    console.log(`Payment retrieved: ${JSON.stringify(payment)}`);
}

export async function processRefund(req: Request, res: Response) {
    res.status(501).json({ message: "Not implemented" });
}

export async function processStormRefund(req: Request, res: Response) {
    res.status(501).json({ message: "Not implemented" });
}

export async function updateMPPaymentStatus(req: Request, res: Response) {
    res.status(501).json({ message: "Not implemented" });
}
