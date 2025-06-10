import mongoose from "mongoose";
import { DbModelName } from "@enum/db-model-name.enum";
import { OrderStatus } from "@enum/order.enum";
import { RuleType } from "@enum/business-rules.enum";

const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema({
    userId:        { type: ObjectId, ref: DbModelName.USER, required: true },
    bookings:    [ { type: ObjectId, ref: DbModelName.BOOKING } ],
    extras: [ {
        name:  { type: String, required: true },
        type:  { type: String, enum: Object.values(RuleType), required: true },
        value: { type: Number, required: true },
        price: { type: Number, required: true }
    } ],
    discounts: [ {
        name:  { type: String, required: true },
        type:  { type: String, enum: Object.values(RuleType), required: true },
        value: { type: Number, required: true },
        price: { type: Number, required: true }
    } ],
    totalPrice:    { type: Number, required: true },
    totalExtras: { type: Number, required: true },
    totalDiscount: { type: Number, required: true },
    finalPrice:    { type: Number, required: true },
    status:        { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
    paymentId:     { type: ObjectId, ref: DbModelName.PAYMENT },
    refundIds:     [{ type: ObjectId, ref: DbModelName.REFUND }]
}, { timestamps: true });

export const Order = mongoose.model(DbModelName.ORDER, orderSchema);
