import mongoose from 'mongoose';
import { DbModelName } from "@enum/db-model-name.enum";
import { PaymentMethod, PaymentStatus } from "@enum/payment.enum";
import { mongooseLuxonDateHook } from "@config/luxon.config";

const { ObjectId } = mongoose.Schema.Types;

const paymentSchema = new mongoose.Schema({
    userId:    { type: ObjectId, ref: DbModelName.USER, required: true },
    orderId:   { type: ObjectId, ref: DbModelName.ORDER, required: true },
    amount:    { type: Number,   required: true, min: 0 },
    method:    { type: String,   enum: Object.values(PaymentMethod), required: true, },
    status:    { type: String,   enum: Object.values(PaymentStatus), required: true },
    reference: { type: String,   default: null },
    paidAt:    { type: Date,     default: null, mongooseLuxonDateHook }
}, { timestamps: true });

export const Payment = mongoose.model(DbModelName.PAYMENT, paymentSchema);
