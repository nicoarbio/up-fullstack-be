import mongoose from 'mongoose';
import { DbModelName } from "./enum/db-model-name.enum.js";
import { Accessory, BookingStatus, Product, RefundStatus } from "./enum/booking.enum.js";

const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema({
    userId:       { type: ObjectId, ref: DbModelName.USER, required: true },
    orderId:      { type: ObjectId, ref: DbModelName.ORDER, required: true },
    product:      {    type: { type: String, enum: Object.values(Product), required: true },
                    stockId: { type: String, ref: DbModelName.STOCK, required: true }
    },
    passengers: [{ fullName: { type: String, required: true },
                   birthdate: { type: Date, required: true },
                   accessories: [{    type: { type: String, enum: Object.values(Accessory), required: true },
                                   stockId: { type: String, ref: DbModelName.STOCK, required: true }
                                }]
    }],
    startTime:    { type: Date, required: true },
    endTime:      { type: Date, required: true },
    price:        { type: Number, required: true },
    discount:     { type: Number, default: 0 },
    finalPrice:   { type: Number, required: true },
    status:       { type: String, enum: Object.values(BookingStatus), default: BookingStatus.ACTIVE },
    refundStatus: { type: String, enum: Object.values(RefundStatus), default: RefundStatus.NONE },
    refundAmount: { type: Number, default: 0 },
}, { timestamps: true });

export const Booking = mongoose.model(DbModelName.BOOKING, bookingSchema);
