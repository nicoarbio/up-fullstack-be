import mongoose from "mongoose";
import { DbModelName } from "./enum/db-model-name.enum.js";
import { ExtraType, OrderStatus } from "./enum/order.enum.js";

const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema({
    userId:        { type: ObjectId, ref: DbModelName.USER, required: true },
    bookings:     [{ type: ObjectId, ref: DbModelName.BOOKING }],
    extras: [{ type:  { type: String, enum: Object.values(ExtraType), required: true },
               price: { type: Number, required: true }
    }],
    totalPrice:    { type: Number, required: true },
    totalDiscount: { type: Number, required: true },
    finalPrice:    { type: Number, required: true },
    status:        { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
    paymentId:     { type: ObjectId, ref: DbModelName.PAYMENT },
}, { timestamps: true });

export const Order = mongoose.model(DbModelName.ORDER, orderSchema);
