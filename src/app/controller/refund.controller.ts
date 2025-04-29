import { Request, Response } from "express";
import mongoose from "mongoose";
import { DateTime } from "luxon";
import { UserRoles } from "@model/user.model";
import { Refund } from "@model/refund.model";
import { Booking } from "@model/booking.model";
import { Order } from "@model/order.model";
import { OrderStatus } from "@enum/order.enum";
import { BookingStatus, ItemRefundStatus } from "@enum/booking.enum";
import { Currency } from "@enum/payment.enum";
import { RefundStatus } from "@enum/refund.enum";
import { DiscountType, ExtraType, PenaltyType, RuleType } from "@enum/business-rules.enum";
import { getBusinessRules } from "@service/business-rules.cache";

export async function processRefund(req: Request, res: Response) {
    const bookingId = req.params.bookingId;
    const reason = req.body.reason;
    const user = req.user!;
    const query: any = {
        _id: bookingId
    }
    if (user.role !== UserRoles.ADMIN) query.userId = user.id;
    const booking = await Booking.findOne(query);
    if (!booking) {
        res.status(404).json({ message: "No se encontró el booking" });
        return;
    }
    const order = await Order.findById(booking.orderId);
    if (!order) {
        res.status(404).json({ message: "No se encontró la orden" });
        return;
    }

    if (order.status === OrderStatus.PENDING || order.status === OrderStatus.CANCELLED) {
        res.status(400).json({ message: "No se puede reembolsar, pues la orden está impaga o cancelada" });
        return;
    }

    let refundPenalty = false;
    const now = DateTime.now();
    const twoHoursFromNow = now.plus({ hours: 2 });
    if (DateTime.fromJSDate(booking.startTime) > twoHoursFromNow) {
        refundPenalty = true;
    }

    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const refund = new Refund({
                userId: order.userId,
                paymentId: order.paymentId,
                orderId: order._id,
                bookingIds: [booking._id],
                amount: 0,
                currency: Currency.ARS,
                reason,
                status: RefundStatus.PENDING,
            });
            await refund.save({ session })

            booking.status = BookingStatus.CANCELLED;
            booking.refundStatus = ItemRefundStatus.PENDING;

            let refundAmount = booking.price;
            if (refundPenalty) {
                const businessRules = await getBusinessRules();
                const penalty = businessRules?.penalties.find(p => p.name === PenaltyType.LATE_CANCELLATION)!
                const penaltyPrice = penalty.type === RuleType.PERCENTAGE ? refundAmount * penalty.value / 100 : penalty.value;
                refundAmount -= penaltyPrice;
            }
            order.refundIds = [...order.refundIds, refund._id];
            order.totalPrice -= booking.price;
            order.finalPrice -= booking.price;
            const bookings = await Booking.find({ _id: { $ne: booking._id }, orderId: order._id, status: BookingStatus.ACTIVE });
            if (bookings.length === 0) {
                order.status = OrderStatus.CANCELLED;
            } else {
                if (order.discounts.length) {
                    const discount = order.discounts[0];
                    if (discount.name === DiscountType.MULTI_BOOKING) {
                        if (bookings.length <= 2) {
                            refundAmount -= discount.price;
                            order.finalPrice += discount.price;
                            order.totalDiscount = 0;
                            order.discounts = [] as any;
                        }
                    }
                }
            }
            refund.amount = refundAmount;
            await refund.save({ session })
            await booking.save({ session });
            await order.save({ session });
            res.status(201).json(refund);
            console.log(`Refund processed: ${JSON.stringify(refund)}`);
            return;
        });
    } catch (error) {
        res.status(500).json({ message: "Error processing refund", error });
    } finally {
        session.endSession();
    }
}

export async function processStormRefund(req: Request, res: Response) {
    const bookingId = req.params.bookingId;
    const reason = "Reembolso por tormenta";

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        res.status(404).json({ message: "No se encontró el booking" });
        return;
    }
    const order = await Order.findById(booking.orderId);
    if (!order) {
        res.status(404).json({ message: "No se encontró la orden" });
        return;
    }

    if (order.status === OrderStatus.PENDING || order.status === OrderStatus.CANCELLED) {
        res.status(400).json({ message: "No se puede reembolsar, pues la orden está impaga o cancelada" });
        return;
    }

    const hasStormInsurance = order?.extras.some(extra => extra?.name === ExtraType.STORM_INSURANCE);
    if (!hasStormInsurance) {
        res.status(400).json({ message: "No se puede reembolsar, pues no tiene seguro de tormenta" });
        return;
    }

    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const refund = new Refund({
                userId: order.userId,
                paymentId: order.paymentId,
                orderId: order._id,
                bookingIds: [booking._id],
                amount: 0,
                currency: Currency.ARS,
                reason,
                status: RefundStatus.PENDING,
            });
            await refund.save({ session })

            booking.status = BookingStatus.CANCELLED;
            booking.refundStatus = ItemRefundStatus.PENDING;

            const businessRules = await getBusinessRules();
            const refundPolicy = businessRules?.refundPolicies.find(p => p.name === ExtraType.STORM_INSURANCE)!
            const penaltyPrice = refundPolicy.type === RuleType.PERCENTAGE ? booking.price * refundPolicy.value / 100 : refundPolicy.value;

            order.refundIds = [...order.refundIds, refund._id];
            order.totalPrice -= booking.price;
            order.finalPrice -= booking.price;
            const bookings = await Booking.find({ _id: { $ne: booking._id }, orderId: order._id, status: BookingStatus.ACTIVE });
            if (bookings.length === 0) {
                order.status = OrderStatus.CANCELLED;
            }
            refund.amount = penaltyPrice;
            await refund.save({ session })
            await booking.save({ session });
            await order.save({ session });
            res.status(201).json(refund);
            console.log(`Storm refund processed: ${JSON.stringify(refund)}`);
        });
    } catch (error) {
        res.status(500).json({ message: "Error processing refund", error });
    } finally {
        session.endSession();
    }
}

export async function getRefund(req: Request, res: Response) {
    const refundId = req.params.id;
    const user = req.user!;
    const query: any = {
        _id: refundId
    };
    if (user.role !== UserRoles.ADMIN) query.userId = user.id;
    const refund = await Refund.findOne(query);
    if (!refund) {
        res.status(404).json({ message: "No se encontró el reembolso" });
        return;
    }
    res.status(200).json(refund);
    console.log(`Refund retrieved: ${JSON.stringify(refund)}`);
}

export async function registerCashRefund(req: Request, res: Response) {
    const refundId = req.params.id;
    const refund = await Refund.findById(refundId);
    if (!refund) {
        res.status(404).json({ message: "No se encontró el reembolso" });
        return;
    }
    if (refund.status === RefundStatus.PROCESSED) {
        res.status(400).json({ message: "El reembolso ya fue procesado" });
        return;
    }
    await Booking.updateOne({ _id: { $in: refund.bookingIds } }, { refundStatus: ItemRefundStatus.REFUNDED });
    refund.status = RefundStatus.PROCESSED;
    refund.processedAt = DateTime.now().toJSDate();
    await refund.save();
    res.status(200).json(refund);

}
