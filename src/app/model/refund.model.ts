import mongoose from 'mongoose';
import { DbModelName } from "@enum/db-model-name.enum";
import { RefundStatus } from "@enum/refund.enum";
import { fromLuxonDateTime, toLuxonDateTime } from "@config/luxon.config";

const { ObjectId } = mongoose.Schema.Types;

const refundSchema = new mongoose.Schema({
    userId:      { type: ObjectId, ref: DbModelName.USER, required: true },
    paymentId:   { type: ObjectId, ref: DbModelName.PAYMENT, required: true },
    orderId:     { type: ObjectId, ref: DbModelName.ORDER, required: true },
    bookingIds: [{ type: ObjectId, ref: DbModelName.BOOKING }],
    amount:      { type: Number,   required: true, min: 0 },
    reason:      { type: String },
    status:      { type: String,   enum: Object.values(RefundStatus), default: RefundStatus.PENDING },
    requestedAt: { type: Date,     default: Date.now, get: toLuxonDateTime, set: fromLuxonDateTime },
    processedAt: { type: Date,     default: null, get: toLuxonDateTime, set: fromLuxonDateTime},
}, { timestamps: true });

export const Refund = mongoose.model(DbModelName.REFUND, refundSchema);


