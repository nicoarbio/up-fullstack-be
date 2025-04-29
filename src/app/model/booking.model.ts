import mongoose from 'mongoose';
import { DbModelName } from "@enum/db-model-name.enum";
import { Accessory, Product } from "@enum/business-rules.enum";
import { BookingStatus, ItemRefundStatus } from "@enum/booking.enum";
import { mongooseLuxonDateHook } from "@utils/datetime.utils";

const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema({
    userId:          { type: ObjectId, ref: DbModelName.USER, required: true },
    orderId:         { type: ObjectId, ref: DbModelName.ORDER, required: true },
    product: {
        type:        { type: String, enum: Object.values(Product), required: true },
        stockId:     { type: String, ref: DbModelName.STOCK, required: true }
    },
    passengers: [ {
        fullName:    { type: String, required: true },
        birthdate:   { type: Date, required: true, mongooseLuxonDateHook },
        accessories: [ {
            type:    { type: String, enum: Object.values(Accessory), required: true },
            stockId: { type: String, ref: DbModelName.STOCK, required: true }
        } ]
    } ],
    startTime:       { type: Date, required: true, mongooseLuxonDateHook },
    endTime:         { type: Date, required: true, mongooseLuxonDateHook },
    price:           { type: Number, required: true },
    status:          { type: String, enum: Object.values(BookingStatus), default: BookingStatus.ACTIVE },
    refundStatus:    { type: String, enum: Object.values(ItemRefundStatus), default: ItemRefundStatus.NONE }
}, { timestamps: true });

export const Booking = mongoose.model(DbModelName.BOOKING, bookingSchema);
